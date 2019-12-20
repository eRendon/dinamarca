<template>
    <Page>
        <ActionBar title="Dinamarca" android:flat="true"/>
        <TabView android:tabBackgroundColor="#53ba82"
                 android:tabTextColor="#c4ffdf"
                 android:selectedTabTextColor="#ffffff"
                 androidSelectedTabHighlightColor="#ffffff">
            <TabViewItem title="QRScanner">
                <QRScanner></QRScanner>
            </TabViewItem>
            <TabViewItem title="Get device data">
                <DataDevice></DataDevice>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script lang="ts">
    import QRScanner from "@/components/QRScanner/QRScanner.vue";
    import DataDevice from "@/components/DataDevice/DataDevice.vue";
  export default {
      components: {
        QRScanner,
          DataDevice
      },
    data() {
      return {
        msg: 'Hello World!'
      }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
