<template>
    <div class="success_wrap f-d-c f-j-a-c">
        <div class="img_box">
            <img src="../assets/img/blind_box.gif" alt="" class="gif_img">
            <img v-if="showCard" :src="TheCard.large" alt="" class="card_img">
        </div>

        <div class="confirm_btn f-j-a-c" @click="onConfirm">{{i18n.BlindBox.Confirm}}</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                id: this.$route.query.id,
                storeList: [
                    { id: 1, key: 'MannedCabin', icon: require('../assets/img/mask_1_b.png'), large: require('../assets/img/mask_1_a.png') },
                    { id: 2, key: 'OrbitalModule', icon: require('../assets/img/mask_2_b.png'), large: require('../assets/img/mask_2_a.png') },
                    { id: 3, key: 'ServiceCabin', icon: require('../assets/img/mask_3_b.png'), large: require('../assets/img/mask_3_a.png') },
                    { id: 4, key: 'ReturnCabin', icon: require('../assets/img/mask_4_b.png'), large: require('../assets/img/mask_4_a.png') }
                ],
                TheCard: {},
                showCard: false
            }
        },
        computed: {
            i18n() {
                return this.$t('message');
            }
        },
        created() {
            // console.log(this.id);
            // console.log(this.storeList);
            this.storeList.map(item => {
                if (this.id == item.id) this.TheCard = item
            });

            setTimeout(() => {
                this.showCard = true;
            }, 3000)
        },
        methods: {
            onConfirm() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .success_wrap {
        width: 100vw;
        height: 100vh;
        background: #000000;

        .img_box {
            width: 100%;
            height: 534px;
            position: relative;

            .gif_img {
                width: 100%;
                height: 534px;
            }

            .card_img {
                width: 420px;
                height: 532px;
                position: absolute;
                top: -220px;
                left: 165px;
            }
        }

        .confirm_btn {
            width: 538px;
            height: 136px;
            background: url(../assets/img/btn_a.png) no-repeat;
            background-size: 100% 100%;
            font-size: 36px;
            font-weight: 600;
            box-sizing: border-box;
        }
    }
</style>