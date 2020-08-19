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
            let user = this.$store.state.authUser;
            if(user){
                await this.$request.userInfo({
                    uid: user.u_id
                });
            }else{
                this.$router.push("/login?redirect=/about-me");
            }
        }
    }
};
</script>
