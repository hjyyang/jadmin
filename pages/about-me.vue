<template>
	<main></main>
</template>

<script>
export default {
	data() {
		return {};
    },
    mounted(){
        if(this.$route.query.is_redirect){
            this.$message.error("无权限访问")
        }
        this.getInfo();
    },
    methods:{
        async getInfo(){
            await this.$request.userInfo();
        }
    }
};
</script>
