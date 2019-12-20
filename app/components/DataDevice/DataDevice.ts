import Vue from 'vue'
import { request} from "tns-core-modules/http";
export default Vue.extend({
    data: () => ({
        dataDevice: []
    }),
    methods: {
        getDataDevice(): void {
            request({
                url: "http://dinamarca-spring-boot.us-east-1.elasticbeanstalk.com:5000/application/findAll",
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }).then((response) => {
                console.log('---->', response.content.toJSON)
                this.dataDevice = response.content.toString();
                alert({
                    title: 'Data',
                    message: this.dataDevice
                })
                console.log(this.dataDevice)
                console.log('--->', response.statusCode)
                // Argument (response) is HttpResponse
            }, (e) => {
                console.log('=====>', e)
            });
        }
    }
})
