<template>
  <div id="default_layout">
    <nuxt />
  </div>
</template>

<script>
export default {
    mounted(){
        console.log(this.$route)
    }
};
</script>