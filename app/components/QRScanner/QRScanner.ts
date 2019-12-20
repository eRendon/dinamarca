import Vue from 'vue'
import { BarcodeScanner } from "nativescript-barcodescanner";
import * as geolocation from "nativescript-geolocation";
const barCodeScanner = new BarcodeScanner();
import { Accuracy } from "tns-core-modules/ui/enums";
const firebase = require("nativescript-plugin-firebase");
export default Vue.extend({
    data: () => ({
       qrScanned: null,
        locationScanned: {
            latitude: null,
            longitude: null
        }
    }),
    created(): void {
        this.initFirebase()
    },
    methods: {
        onChildEvent(result): void {
            console.log("Values: " +
                JSON.stringify(result));
        },
        scanQr(): void {
            barCodeScanner
                .scan({
                    formats: "QR_CODE, EAN_13",
                    cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
                    cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                    message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                    showFlipCameraButton: true, // default false
                    preferFrontCamera: false, // default false
                    showTorchButton: true, // default false
                    beepOnScan: true, // Play or Suppress beep on scan (default true)
                    fullScreen: true, // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
                    torchOn: false, // launch with the flashlight on (default false)
                    closeCallback: () => {
                        console.log("Scanner closed");
                    }, // invoked when the scanner was closed (success or abort)
                    resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                    orientation: "", // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
                    openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
                    presentInRootViewController: true // iOS-only; If you're sure you're not presenting the (non embedded) scanner in a modal, or are experiencing issues with fi. the navigationbar, set this to 'true' and see if it works better for your app (default false).
                })
                .then(
                    result => {
                        this.qrScanned = result.text
                        console.log('----->', result);
                        // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
                        alert({
                            title: "Scan result",
                            message: "Format: " + result.format + ",\nValue: " + result.text,
                            okButtonText: "OK"
                        });
                    },
                    errorMessage => {
                        console.log("No scan. " + errorMessage);
                    }
                );
        },
        getGeoLocation():void {
            geolocation.enableLocationRequest()
            geolocation
                .getCurrentLocation({
                    desiredAccuracy: Accuracy.high,
                    maximumAge: 5000,
                    timeout: 20000
                })
                .then(location => {
                    // console.log(location);
                    console.log(JSON.stringify({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }))
                    this.locationScanned = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }

                    alert({
                        title: "Scan result",
                        message: "Location: " + JSON.stringify({
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }),
                        okButtonText: "OK"
                    });
                });
        },
        validData(): void {
            (this.qrScanned && this.locationScanned.longitude) ?  this.SendDataDevice() : this.presentAlert('Error', 'Faltan datos por agregar')
        },
        SendDataDevice(): void {
            firebase.push('DataDevice', {
                qrScanned: this.qrScanned,
                locationScanned: this.locationScanned
            }).then(result => {
                alert({
                    title: "Datos enviados",
                    message: "Sus datos han sido enviados ",
                    okButtonText: "OK"
                });
                console.log(result)
            }).catch(error =>{
                console.log(error)
            })
        },
        initFirebase(): void {
            firebase.init({
                persist: true,
                // Optionally pass in properties for database, authentication and cloud messaging,
                // see their respective docs.
            }).then(
                () => {
                    firebase.addChildEventListener(this.onChildEvent, "DataDevice").then((snapshot) => {
                        console.log("[*] Info : We've some data !", snapshot);
                    });
                    console.log("firebase.init done");
                },
                error => {
                    console.log(`firebase.init error: ${error}`);
                }
            );
        },
        presentAlert(title: string, message: string): void {
            alert({
                title,
                message,
                okButtonText: "OK"
            });
        }
    }
})
