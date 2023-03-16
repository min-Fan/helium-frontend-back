<template>
    <div class="null">
        <div class="text_box">
            <h1>404</h1>
            <span>Can't find the resource path</span>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.null{
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    .text_box{
        text-align: center;
        h1{
            // font-size: 50px;
            display: block;
            margin: auto;
            margin-top: 200px;
        }
        span{
            font-size: 20px;
            display: block;
        }
    }
}
</style>