import { Script } from 'vm';
<template>
    <div class="footer">
        <!-- <div class="footer_block wrapper">
            <div class="footer_left">
                <div class="footer_left_top">
                    <img :src="WebApp.getImage('3ju/b_logo.png')" alt="" />
                </div>
                <div class="footer_left_info">
                    <div class="footer_info_left">
                        <p class="footer_contact">联系我们</p>
                        <div class="footer_phone">
                            <p>地址：湖北省武汉市洪山区中建光谷之星H栋</p>
                            <p>电话：027-65276527</p>
                            <p>邮编：430075</p>
                        </div>
                    </div>
                    <div class="footer_visit_left">
                        <div class="visit_item">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="48" rx="24" fill="#006AFF" fill-opacity="0.05" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.3333 22.0002C15.3333 21.632 15.6318 21.3335 16 21.3335H32C32.3682 21.3335 32.6666 21.632 32.6666 22.0002V27.3335C32.6666 32.12 28.7864 36.0002 24 36.0002C19.2135 36.0002 15.3333 32.12 15.3333 27.3335V22.0002ZM16.6666 22.6668V27.3335C16.6666 31.3836 19.9499 34.6668 24 34.6668C28.0501 34.6668 31.3333 31.3836 31.3333 27.3335V22.6668H16.6666Z" fill="#006AFF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.3333 12.6667C23.3333 12.2985 23.6318 12 24 12H26.3673C29.5152 12 32.1278 14.4327 32.3521 17.5725L32.665 21.9525C32.6781 22.1371 32.614 22.3189 32.4879 22.4543C32.3618 22.5897 32.185 22.6667 32 22.6667H24C23.6318 22.6667 23.3333 22.3682 23.3333 22V12.6667ZM24.6666 13.3333V21.3333H31.284L31.0222 17.6675C30.8477 15.2254 28.8157 13.3333 26.3673 13.3333H24.6666Z" fill="#006AFF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6479 17.5725C15.8721 14.4327 18.4848 12 21.6326 12H24C24.3682 12 24.6666 12.2985 24.6666 12.6667V22C24.6666 22.3682 24.3682 22.6667 24 22.6667H16C15.8149 22.6667 15.6382 22.5897 15.5121 22.4543C15.386 22.3189 15.3218 22.1371 15.335 21.9525L15.6479 17.5725ZM21.6326 13.3333C19.1843 13.3333 17.1522 15.2254 16.9778 17.6675L16.716 21.3333H23.3333V13.3333H21.6326Z" fill="#006AFF" />
                            </svg>
                            <div class="visit_title">
                                <p class="visit_text">访问量</p>
                                <p class="visit_num">{{ footData.browseNum }}</p>
                            </div>
                        </div>

                        <div class="visit_item">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="48" rx="24" fill="#006AFF" fill-opacity="0.05" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.6667 30.6667C20.6667 30.2985 20.9651 30 21.3333 30H26.6667C27.0349 30 27.3333 30.2985 27.3333 30.6667V34C27.7015 34 28 34.2985 28 34.6667C28 35.0349 27.7015 35.3333 27.3333 35.3333H20.6667C20.2985 35.3333 20 35.0349 20 34.6667C20 34.2985 20.2985 34 20.6667 34V30.6667ZM22 34H26V31.3333H22V34Z" fill="#006AFF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3333 14.6667C11.3333 14.2985 11.6318 14 12 14H36C36.3682 14 36.6666 14.2985 36.6666 14.6667V30.6667C36.6666 31.0349 36.3682 31.3333 36 31.3333H12C11.6318 31.3333 11.3333 31.0349 11.3333 30.6667V14.6667ZM12.6666 15.3333V30H35.3333V15.3333H12.6666Z" fill="#006AFF" />
                            </svg>
                            <div class="visit_title">
                                <p class="visit_text">PC在线人数</p>
                                <p class="visit_num">{{ footData.pcNum }}</p>
                            </div>
                        </div>
                        <div class="visit_item">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="48" rx="24" fill="#006AFF" fill-opacity="0.05" />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M16.6667 14.0002C16.6667 12.5274 17.8606 11.3335 19.3334 11.3335H28.6667C30.1394 11.3335 31.3334 12.5274 31.3334 14.0002V34.0002C31.3334 35.4729 30.1394 36.6668 28.6667 36.6668H19.3334C17.8606 36.6668 16.6667 35.4729 16.6667 34.0002V14.0002ZM19.3334 12.6668C18.597 12.6668 18 13.2638 18 14.0002V34.0002C18 34.7365 18.597 35.3335 19.3334 35.3335H28.6667C29.4031 35.3335 30 34.7365 30 34.0002V14.0002C30 13.2638 29.4031 12.6668 28.6667 12.6668H19.3334Z"
                                    fill="#006AFF"
                                />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.6667 34.0002C20.6667 33.632 20.9652 33.3335 21.3334 33.3335H26.6667C27.0349 33.3335 27.3334 33.632 27.3334 34.0002C27.3334 34.3684 27.0349 34.6668 26.6667 34.6668H21.3334C20.9652 34.6668 20.6667 34.3684 20.6667 34.0002Z" fill="#006AFF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 14.0002C22 13.632 22.2985 13.3335 22.6667 13.3335H25.3333C25.7015 13.3335 26 13.632 26 14.0002C26 14.3684 25.7015 14.6668 25.3333 14.6668H22.6667C22.2985 14.6668 22 14.3684 22 14.0002Z" fill="#006AFF" />
                            </svg>
                            <div class="visit_title">
                                <p class="visit_text">小程序在线人数</p>
                                <p class="visit_num">{{ footData.vxNum }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer_right">
            </div>
        </div> -->
        <div class="footer_address wrapper">
            <span><span style="margin: 0"  >©</span>AdvertisingPlatform. 2024 DaEr.</span>
            <!-- <span>备案号：<a href="https://beian.miit.gov.cn/">鄂ICP备2022019590号</a></span> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { getFootData } from '@/api/home';
import * as WebApp from '@/utils/webapp';

onMounted(() => {
    // getFootList();
});
const footData = reactive({
    browseNum: null,
    pcNum: null,
    vxNum: null,
});

async function getFootList() {
    const res = await getFootData();
    if (res) {
        Object.assign(footData, res);
    }
}
 
</script>
<style lang="less" scoped>
.wrapper {
    width: 1400px;
    margin: 0 auto;
}
.footer {
    padding-bottom: 64px;
    background: #fff;
    border-top: 1px solid #e2e5e9;

    .footer_block {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        padding: 60px 0 20px;

        .footer_left {
            width: 50%;

            .footer_left_top img {
                height: 32px;
            }

            .footer_left_info {
                margin-top: 40px;
                color: #333;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;

                .footer_contact {
                    width: fit-content;
                    font-size: 24px;
                    line-height: 32px;
                    margin-bottom: 20px;
                }

                .footer_phone {
                    font-size: 16px;
                    line-height: 24px;
                }

                .footer_visit_left {
                    .visit_item {
                        display: flex;
                        margin-bottom: 20px;

                        .visit_title {
                            height: 48px;
                            margin-left: 20px;

                            .visit_text {
                                font-size: 16px;
                                line-height: 22px;
                            }

                            .visit_num {
                                font-size: 24px;
                                line-height: 30px;
                                font-weight: 500;
                                color: #333333;
                            }
                        }
                    }
                }
            }
        }

        .footer_right {
            width: 128px;
            height: 128px;
            margin-right: 60px;
            .footer_wxcode {
                width: 100%;
            }
        }
    }

    .footer_address {
        font-size: 16px;
        line-height: 64px;
        color: #333;
        margin: 0px auto;
        height: 64px;
        border-top: 1px solid #4075bf26;

        span {
            margin-right: 2%;

            a {
                color: #333;
                text-decoration: none;
            }
        }
    }
}
</style>
