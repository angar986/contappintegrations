//
//  AppDelegate+FCMPlugin.m
//  TestApp
//
//  Created by felipe on 12/06/16.
//
//


#import "AppDelegate+FCMPlugin.h"
#import "FCMPlugin.h"
#import <objc/runtime.h>
#import <Foundation/Foundation.h>

#import "Firebase.h"

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@import UserNotifications;
#endif

@import FirebaseInstanceID;
@import FirebaseMessaging;

// Implement UNUserNotificationCenterDelegate to receive display notification via APNS for devices
// running iOS 10 and above. Implement FIRMessagingDelegate to receive data message via FCM for
// devices running iOS 10 and above.
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@interface AppDelegate () <UNUserNotificationCenterDelegate, FIRMessagingDelegate>
@end
#endif

// Copied from Apple's header in case it is missing in some cases (e.g. pre-Xcode 8 builds).
#ifndef NSFoundationVersionNumber_iOS_9_x_Max
#define NSFoundationVersionNumber_iOS_9_x_Max 1299
#endif

@implementation AppDelegate (MCPlugin)

static NSData *lastPush;
NSString *const kGCMMessageIDKey = @"gcm.message_id";

//Method swizzling
+ (void)load
{
    Method original =  class_getInstanceMethod(self, @selector(application:didFinishLaunchingWithOptions:));
    Method custom =    class_getInstanceMethod(self, @selector(application:customDidFinishLaunchingWithOptions:));
    method_exchangeImplementations(original, custom);
}

- (BOOL)application:(UIApplication *)application customDidFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    [self application:application customDidFinishLaunchingWithOptions:launchOptions];

    NSLog(@"DidFinishLaunchingWithOptions antes");
 
    
    // Register for remote notifications. This shows a permission dialog on first run, to
    // show the dialog at a more appropriate time move this registration accordingly.
    if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_7_1) {
        // iOS 7.1 or earlier. Disable the deprecation warnings.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
        UIRemoteNotificationType allNotificationTypes =
        (UIRemoteNotificationTypeSound |
         UIRemoteNotificationTypeAlert |
         UIRemoteNotificationTypeBadge);
        [application registerForRemoteNotificationTypes:allNotificationTypes];
        NSLog(@"DidFinishLaunchingWithOptions ios 7 or later");
#pragma clang diagnostic pop
    } else {
        // iOS 8 or later
        // [START register_for_notifications]
        if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_9_x_Max) {
            UIUserNotificationType allNotificationTypes =
            (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
            UIUserNotificationSettings *settings =
            [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
            [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
            NSLog(@"DidFinishLaunchingWithOptions ios 8 or later");
            
        } else {
            // iOS 10 or later
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
            UNAuthorizationOptions authOptions =
            UNAuthorizationOptionAlert
            | UNAuthorizationOptionSound
            | UNAuthorizationOptionBadge;
            [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:authOptions completionHandler:^(BOOL granted, NSError * _Nullable error) {
            }];
            
            // For iOS 10 display notification (sent via APNS)
            [UNUserNotificationCenter currentNotificationCenter].delegate = self;
            
//            UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
//            [center removeAllDeliveredNotifications];
            
            
            // For iOS 10 data message (sent via FCM)
            [FIRMessaging messaging].remoteMessageDelegate = self;
            
            NSLog(@"DidFinishLaunchingWithOptions ios 10 or later");
            
#endif
        }
        
        [[UIApplication sharedApplication] registerForRemoteNotifications];
        
        // [END register_for_notifications]
    }

    // [START configure_firebase]
    [FIRApp configure];
    // [END configure_firebase]
    // Add observer for InstanceID token refresh callback.
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(tokenRefreshNotification:)
                                                 name:kFIRInstanceIDTokenRefreshNotification object:nil];
    return YES;
}

// [START message_handling]
// Receive displayed notifications for iOS 10 devices.

// Note on the pragma: When compiling with iOS 10 SDK, include methods that
//                     handle notifications using notification center.
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0

// Handle incoming notification messages while app is in the foreground.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
    
    NSLog(@"ios 10 o later userNotificationCenter");
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
    
    // Print message ID.
    NSDictionary *userInfo = notification.request.content.userInfo;
    if (userInfo[kGCMMessageIDKey]) {
        NSLog(@"Message ID 1: %@", userInfo[kGCMMessageIDKey]);
    }
    
    // Print full message.
    NSLog(@"%@", userInfo);
    
    NSError *error;
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                       options:0
                                                         error:&error];
    [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
    
    // Change this to your preferred presentation option
    completionHandler(UNNotificationPresentationOptionNone);
    
    //Pajarito
    completionHandler(UNNotificationPresentationOptionAlert + UNNotificationPresentationOptionSound);
    completionHandler(UNNotificationPresentationOptionAlert);
    NSLog(@"Userinfo %@",notification.request.content.userInfo);
}

// Handle notification messages after display notification is tapped by the user.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)())completionHandler {
    completionHandler();
    
    NSLog(@"ios 10 o later userNotificationCenter completionHandler");
    
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    if (userInfo[kGCMMessageIDKey]) {
        NSLog(@"Message ID 2: %@", userInfo[kGCMMessageIDKey]);
    }
    
    // Print full message.
    NSLog(@"aaa%@", userInfo);
    
    NSError *error;
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    

        NSLog(@"New method with push callback: %@", userInfo);
        
        [userInfoMutable setValue:@(YES) forKey:@"wasTapped"];
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                           options:0
                                                             error:&error];
        NSLog(@"APP WAS CLOSED DURING PUSH RECEPTION Saved data: %@", jsonData);
        lastPush = jsonData;

    
    completionHandler();
}
#endif

// [START receive_message in background iOS < 10]

// Include the iOS < 10 methods for handling notifications for when running on iOS < 10.
// As in, even if you compile with iOS 10 SDK, when running on iOS 9 the only way to get
// notifications is the didReceiveRemoteNotification.



- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
    NSLog(@"aca estoy 1");
    
    // Short-circuit when actually running iOS 10+, let notification centre methods handle the notification.
    if (NSFoundationVersionNumber >= NSFoundationVersionNumber_iOS_9_x_Max) {
        return;
    }

    NSLog(@"Message ID: %@", userInfo[@"gcm.message_id"]);
    
    NSError *error;
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    
    if (application.applicationState != UIApplicationStateActive) {
        NSLog(@"New method with push callback: %@", userInfo);
        
        [userInfoMutable setValue:@(YES) forKey:@"wasTapped"];
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                           options:0
                                                             error:&error];
        NSLog(@"APP WAS CLOSED DURING PUSH RECEPTION Saved data: %@", jsonData);
        lastPush = jsonData;
        
    }
    
    
    NSInteger badgeNumber = [application applicationIconBadgeNumber];
    
    //Pajarito
    [application setApplicationIconBadgeNumber:++badgeNumber];

    
    
}
// [END receive_message in background] iOS < 10]

// [START receive_message iOS < 10]
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    
    
    
//    // Short-circuit when actually running iOS 10+, let notification centre methods handle the notification.
//    if (NSFoundationVersionNumber >= NSFoundationVersionNumber_iOS_9_x_Max) {
//        NSLog(@"ios 10 o later");
//        return;
//    }
    
    NSLog(@"ios aca stpoy");

    // If you are receiving a notification message while your app is in the background,
    // this callback will not be fired till the user taps on the notification launching the application.
    // TODO: Handle data of notification

    // Print message ID.
    NSLog(@"Message ID: %@", userInfo[@"gcm.message_id"]);

    // Pring full message.
    NSLog(@"%@", userInfo);
    NSError *error;

    NSDictionary *userInfoMutable = [userInfo mutableCopy];

    // Has user tapped the notificaiton?
    // UIApplicationStateActive   - app is currently active
    // UIApplicationStateInactive - app is transitioning from background to
    //                              foreground (user taps notification)

//    UIApplicationState state = application.applicationState;
    if (application.applicationState == UIApplicationStateActive
        || application.applicationState == UIApplicationStateInactive) {
        [userInfoMutable setValue:@(NO) forKey:@"wasTapped"];
        NSLog(@"app active");
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                           options:0
                                                             error:&error];
        [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
        

    // app is in background
    }

    
    
    
    //Pajarito
    
    if(application.applicationState == UIApplicationStateInactive) {
        
        NSLog(@"Inactive - the user has tapped in the notification when app was closed or in background");
        //do some tasks
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                           options:0
                                                             error:&error];
        [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
        //            [self manageRemoteNotification:userInfo];
        completionHandler(UIBackgroundFetchResultNewData);
    } else if (application.applicationState == UIApplicationStateBackground) {
        
        NSLog(@"application Background - notification has arrived when app was in background");
        NSString* contentAvailable = [NSString stringWithFormat:@"%@", [[userInfo valueForKey:@"aps"] valueForKey:@"content-available"]];
        
        if([contentAvailable isEqualToString:@"1"]) {
            // do tasks
            [UIApplication sharedApplication].applicationIconBadgeNumber = [UIApplication sharedApplication].applicationIconBadgeNumber + 1;
            
//                            [self manageRemoteNotification:userInfo];
            NSLog(@"content-available is equal to 1");
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                               options:0
                                                                 error:&error];
            //                lastPush = jsonData;
            [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
            
            completionHandler(UIBackgroundFetchResultNewData);
        }
    }else {
        // app is in background or in stand by (NOTIFICATION WILL BE TAPPED)
        NSLog(@"application Active - notication has arrived while app was opened");
        [userInfoMutable setValue:@(NO) forKey:@"wasTapped"];
        NSLog(@"app active");
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                           options:0
                                                             error:&error];
        [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
        [FCMPlugin.fcmPlugin appEnterForeground];
        
        //Show an in-app banner
        //do tasks
        //            [self manageRemoteNotification:userInfo];
        completionHandler(UIBackgroundFetchResultNewData);
    }
}
// [END receive_message iOS < 10]
// [END message_handling]
    



//pajarito



// [START refresh_token]
- (void)tokenRefreshNotification:(NSNotification *)notification
{
    // Note that this callback will be fired everytime a new token is generated, including the first
    // time. So if you need to retrieve the token as soon as it is available this is where that
    // should be done.
    NSString *refreshedToken = [[FIRInstanceID instanceID] token];
    NSLog(@"InstanceID token: %@", refreshedToken);
    [FCMPlugin.fcmPlugin notifyOfTokenRefresh:refreshedToken];
    // Connect to FCM since connection may have failed when attempted before having a token.
    [self connectToFcm];

    // TODO: If necessary send token to appliation server.
}
// [END refresh_token]

// [START connect_to_fcm]
- (void)connectToFcm{
    
    // Won't connect since there is no token
    if (![[FIRInstanceID instanceID] token]) {
        return;
    }
    
    // Disconnect previous FCM connection if it exists.
    [[FIRMessaging messaging] disconnect];
    
    [[FIRMessaging messaging] connectWithCompletion:^(NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"Unable to connect to FCM. %@", error);
        } else {
            NSLog(@"Connected to FCM.");
            [[FIRMessaging messaging] subscribeToTopic:@"/topics/ios"];
            [[FIRMessaging messaging] subscribeToTopic:@"/topics/all"];
        }
    }];
}
// [END connect_to_fcm]

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
    
    NSLog(@"app become active");
    [FCMPlugin.fcmPlugin appEnterForeground];
    [self connectToFcm];
}

// [START disconnect_from_fcm]
- (void)applicationDidEnterBackground:(UIApplication *)application
{
    
    NSLog(@"app entered background");
    [[FIRMessaging messaging] disconnect];
    [FCMPlugin.fcmPlugin appEnterBackground];
    NSLog(@"Disconnected from FCM");
}
// [END disconnect_from_fcm]

+(NSData*)getLastPush
{
    NSData* returnValue = lastPush;
    lastPush = nil;
    return returnValue;
}
    
    
//    //Pajarito

- (void)messaging:(nonnull FIRMessaging *)messaging didRefreshRegistrationToken:(nonnull NSString *)fcmToken {
    // Note that this callback will be fired everytime a new token is generated, including the first
    // time. So if you need to retrieve the token as soon as it is available this is where that
    // should be done.
    NSLog(@"FCM registration token: %@", fcmToken);
    
    // TODO: If necessary send token to application server.
}


- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
        
    // for development
//    [[FIRInstanceID instanceID] setAPNSToken:deviceToken type:FIRInstanceIDAPNSTokenTypeSandbox];
    
    // for production
//    [[FIRInstanceID instanceID] setAPNSToken:deviceToken type:FIRInstanceIDAPNSTokenTypeProd];
    
    #if DEBUG
        [[FIRInstanceID instanceID] setAPNSToken:deviceToken type:FIRInstanceIDAPNSTokenTypeSandbox];
    #else
        [[FIRInstanceID instanceID] setAPNSToken:deviceToken type:FIRInstanceIDAPNSTokenTypeProd];
    #endif
    
}


    //Para borra el numero de notificacion del icono
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
    {
        UIApplicationState state = [application applicationState];
        if (state == UIApplicationStateActive) {
        }
        
        // Request to reload table view data
        [[NSNotificationCenter defaultCenter] postNotificationName:@"reloadData" object:self];
        
        // Set icon badge number to zero
        [[UIApplication sharedApplication] cancelAllLocalNotifications];
        [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
    }




        //Fin Pajarito


@end