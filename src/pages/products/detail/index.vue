<template>
  <div>
    <div class="top-filter">
      <div class="large-item">
        <div>
          <t-button variant="text" shape="square" @click="">
            <template #icon>
              <img width="auto" height="12" :src="WebApp.getImage('products/group.png')" alt="logo" />
            </template>
            国家/地区
          </t-button>
        </div>
        <div>
          <t-select v-model="country">
            <template #prefixIcon>
              <img width="auto" height="12" v-if="countryIcon" :src="WebApp.getImage(countryIcon)" alt="logo" />
            </template>
            <t-option v-for="item in countrys" :key="item.value" :value="item.content">
              <img width="auto" height="12" :src="WebApp.getImage(item.icon)" alt="logo" />
                {{ item.content }}
            </t-option>
          </t-select>
        </div>
      </div>
      <div class="large-item">
        <div>
          <t-button variant="text" shape="square" @click="">
            <template #icon>
              <img width="auto" height="12" :src="WebApp.getImage('products/menu.png')" alt="logo" />
            </template>
            数据源
          </t-button>
        </div>
        <t-select v-model="category" value-type="object" filterable placeholder="请选择/搜索" :options="categoryList"
          @search="searchCategory" :loading="loading2" reserveKeyword
          style="width: 90%; margin: 0 auto; border: none !important;" />
      </div>
      <img class="prd-search" :src="WebApp.getImage('common/product_search.png')" />
    </div>
    <div class="prd">
      <img :src="WebApp.getImage(product.cover)" alt="" srcset="">
      <div class="prd_info">
        <p>
          {{ product.title }}
        </p>
        <p>
          {{ product.origin }}
        </p>
        <div class="desc">
          <t-rate v-model="product.star_rating" disabled :count="5" size="12px" color="#FF3600" />
          <span class="start_rate">{{ product.star_rating.toFixed(1) }}</span>

          <p>{{ product.comments }}条评价</p>
          <p>{{ product.returnVolumnComments }}条退货评价</p>
        </div>
      </div>
      
      <t-button class="btn">关注商品</t-button>
      <t-button class="btn view_voice">查看原声</t-button>
      <!-- <img class="btn" :src="WebApp.getImage('products/follow_btn.png')" /> -->
      <!-- <img class="btn view_voice" :src="WebApp.getImage('products/view_voices.png')" /> -->
    </div>
    <t-space class="top-nav">
      <t-radio-group class="tabs" v-model="curTabs" default-value="3">
        <t-radio-button value="1">重点问题跟进</t-radio-button>
        <t-radio-button value="2">客户反馈分析</t-radio-button>
        <t-radio-button value="3">对比分析</t-radio-button>
      </t-radio-group>
      <t-radio-group class="period" default-value="1" style="background: #fff">
        <t-radio-button value="1">近一个月</t-radio-button>
        <t-radio-button value="2">近三个月</t-radio-button>
        <t-radio-button value="3">近半年</t-radio-button>
        <t-radio-button value="4">近一年</t-radio-button>
        <t-radio-button value="5">上架至今</t-radio-button>
      </t-radio-group>
      <t-date-range-picker v-model="range1" :presets="presets" style="width:210px" format="YYYY/MM/DD" >
        <template #prefixIcon>
          <img width="auto" height="12" :src="WebApp.getImage('products/datepicker.png')" alt="logo" />
        </template>
      </t-date-range-picker>
    </t-space>
    <div class="cards" v-if="curTabs === '1'">
      <problemAnalysis :adChart="{index: 1}" :shopDataTime="shopDataTime" />
      <problemAnalysis :adChart="{index: 2}" :shopDataTime="shopDataTime" />
      <problemAnalysis :adChart="{index: 3}" :shopDataTime="shopDataTime" />
    </div>
    <div class="cards bg" v-if="curTabs === '2'">
      <div class="comments_option">
        <p>
          <span>尺码</span>
          <t-radio-group 
            v-model="checkedSize" 
            :options="['X-Large', 'Large', 'Medium', 'Samll']" 
            name="size"
          ></t-radio-group>
        </p>
        <p>
          <span>颜色</span>
          <t-radio-group 
            v-model="checkedColor" 
            :options="['蓝色', '红色', '绿色', '深蓝色', '橙色']" 
            name="color"
          ></t-radio-group>
        </p>
        <t-divider></t-divider>
        <t-tabs :default-value="1">
          <t-tab-panel :value="1" label="差评分析">
            <div style="margin: 20px" class="comments_analysis">
              <feedbackChart :adChart="{index: 1}" :shopDataTime="shopDataTime" />
              <feedbackChart :adChart="{index: 2}" :shopDataTime="shopDataTime" />
              <feedbackChart :adChart="{index: 3}" :shopDataTime="shopDataTime" />
            </div>
          </t-tab-panel>
          <t-tab-panel :value="2" label="好评分析">
            <div style="margin: 20px" class="comments_analysis">
              <feedbackChart :adChart="{index: 1}" :shopDataTime="shopDataTime" />
              <feedbackChart :adChart="{index: 2}" :shopDataTime="shopDataTime" />
              <feedbackChart :adChart="{index: 3}" :shopDataTime="shopDataTime" />
            </div>
          </t-tab-panel>
        </t-tabs>
      </div>
    </div>
    <div class="compare_card" v-if="curTabs === '3'">
      
      <t-tabs v-model="vsTab" :default-value="1">
        <t-tab-panel :value="1" label="商品VS商品">
          <div class="compare_filter">
            <div class="compare_type">
              <div>
                <label>国家</label>
                <t-select v-model="country">
                  <template #prefixIcon>
                    <img width="auto" height="12" v-if="countryIcon" :src="WebApp.getImage(countryIcon)" alt="logo" />
                  </template>
                  <t-option v-for="item in countrys" :key="item.value" :value="item.content">
                    <img width="auto" height="12" :src="WebApp.getImage(item.icon)" alt="logo" />
                      {{ item.content }}
                  </t-option>
                </t-select>
              </div>
              <div>
                <label>商品ASIN</label>
                <t-select v-model="category" 
                  value-type="object" 
                  filterable 
                  placeholder="请选择/搜索" 
                  :options="categoryList"
                  @search="searchCategory" 
                  :loading="loading2" 
                  reserveKeyword
                />
              </div>
              <t-button>开始对比</t-button>
            </div>
            <div class="prd">
              <span>对方<br/>信息</span>
              <img :src="WebApp.getImage(product.cover)" alt="" srcset="">
              <div class="prd_info">
                <p>
                  {{ product.title }}
                </p>
                <div class="desc">
                  <label>
                    {{ product.origin }}
                  </label>
                  <t-rate v-model="product.star_rating" disabled :count="5" size="12px" color="#FF3600" />
                  <span class="start_rate">{{ product.star_rating.toFixed(1) }}</span>

                  <p>{{ product.comments }}条评价</p>
                  <p>{{ product.returnVolumnComments }}条退货评价</p>
                </div>
              </div>
            </div>
          </div>
        </t-tab-panel>
        <t-tab-panel :value="2" label="商品VS品牌">
        </t-tab-panel>
        <t-tab-panel :value="3" label="商品VS店铺">
        </t-tab-panel>
        <t-tab-panel :value="4" label="商品VS行业">
        </t-tab-panel>
      </t-tabs>
      <div class="comparative">
        <comparativeChart class="bg" :adChart="{index: 1}" :shopDataTime="shopDataTime" />
        <comparativeChart class="bg" :adChart="{index: 2}" :shopDataTime="shopDataTime" />
        <comparativeChart class="bg" :adChart="{index: 3}" :shopDataTime="shopDataTime" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as WebApp from '@/utils/webapp';
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
import problemAnalysis from '@/components/echarts/problemAnalysis.vue'
import feedbackChart from '@/components/echarts/feedbackChart.vue'
import comparativeChart from '@/components/echarts/comparativeChart.vue'
const shopDataTime = ref('');
const countrys = ref([
  {
    content: '中国',
    value: 'china',
    icon: 'products/China.png',
  }, {
    content: '美国',
    value: 'US',
    icon: 'products/US.png',
  }, {
    content: '日本',
    value: 'Japan',
    icon: 'products/Japan.png',
  }, {
    content: '法国',
    value: 'French',
    icon: 'products/French.png',
  }
]);
const presets = ref ({
  '最近7天': [new Date(+new Date() - 86400000 * 6), new Date()],
  '最近3天': [new Date(+new Date() - 86400000 * 2), new Date()],
  '今天': [new Date(), new Date()],
});
const range1 = ref(['2024-01-01', '2024-08-08']);
const country = ref('中国'), countryIcon = ref('products/China.png');
const product = ref({
  title: 'Under Armour 安德瑪 男款 Tech Golf Polo 衫',
  cover: 'products/prd_1.png',
  origin: '亚马逊',
  star_rating: 4,
  comments: 529,
  returnVolumnComments: 189
})

const curTabs = ref('1'), 
  checked = ref(''), 
  checkedSize = ref(''), 
  checkedColor = ref(''), 
  loading2 = ref(false), 
  category = ref(''), 
  categoryList = ref([]),
  vsTab = ref(1);

const searchCategory = (search: string) => {
  console.log('search', search);
  loading2.value = true;
  setTimeout(() => {
    loading2.value = false;
    categoryList.value = [
      {
        value: `${search}1`,
        label: `${search}test1`,
      },
      {
        value: `${search}2`,
        label: `${search}test2`,
      },
      {
        value: `${search}3`,
        label: `${search}test3`,
      },
    ];
  }, 500);
}

watch(country, (newVal) => {
  const item = countrys.value.find(v => v.content === newVal);
  countryIcon.value = item ? item.icon : ''
});
</script>

<style lang="less" scoped>

.top-filter {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  padding: 0px 0 16px;
  
  .large-item {
    width: 256px;
    height: 114px;
    background: #fff;
    border-radius: 4px;
    margin-right: 16px;
    // flex: 2;

    &:hover {
      box-shadow: 2px 2px 8px #bebebe,
        -2px -2px 8px #ffffff;
    }

    div {
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #F7F7FA;
    }
    
    :deep(.t-select-input .t-input) {
      border: none;
    }

    .t-button--variant-text:hover, .t-button--variant-text:focus-visible {
      background: transparent;
    }

    :deep(.t-input:hover),
    :deep(.t-input--focused) {
      appearance: none;
      box-shadow: none;
      background: transparent;
    }

    .tdesign-demo-dropdown {

      .t-button--variant-text {
        width: 100%;
        justify-content: space-between;
      }
    }
  }
  .prd-search {
    flex: 0;
  }

  .t-button--shape-square {
    width: auto;
    padding: 0 15px;
  }

  :deep(.t-button__text) {
    margin-left: 5px;
    font-size: 12px;
    color: #111111;
  }

  :deep(.t-dropdown__item) {
    min-width: 136px;
  }
}

.prd {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  img {
    width: 72px;
    height: 72px;
    margin-right: 12px;
  }

  .prd_info {
    // display: flex;
    flex: 1;
    p {
      font: PingFang SC;
      font-weight: 600;
      font-size: 12px;
      line-height: 18px;
      color: #111111;

      &:nth-child(2) {
        margin-top: 11px;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-align: left;
        color: #AAAAAA;
      }

      img {
        width: 12px;
        height: 12px;
      }
    }

    .desc {
      display: flex;
      align-items: center;
      label {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-align: left;
        color: #AAAAAA;
        margin-right: 24px;
      }

      .start_rate {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 600;
        line-height: 14px;
        text-align: left;
        color: #111111;
        margin-left: 5px;
      }

      p {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-align: left;
        color: #666666;
        margin: 0 0 0 24px;
        cursor: pointer;
      }
    }
  }

  :deep(.t-button) {
    margin-right: 16px;
    background: linear-gradient(0deg, #003469, #003469),
      radial-gradient(110.29% 21.62% at 50% 100%, #006FDF 0%, rgba(0, 52, 105, 0.0001) 100%);
    
    .t-button__text {
      font-family: PingFang SC;
      font-size: 11px;
      font-weight: 400;
      line-height: 12px;
      text-align: left;
      color: #FFFFFF;
    }
  }

  // .btn {
  //   width: 120px;
  //   height: 40px;
  //   cursor: pointer;
  // }

  .view_voice {
    margin-right: 50px;
    border: 1px solid #003469;
    background: #FFFFFF;

    :deep(.t-button__text) {
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      text-align: left;
      color: #111111;
    }
  }
}

:deep(.top-nav.t-space) {
  display: flex;
  justify-content: space-between;

  .t-space-item{
    flex-shrink: 0;
    &:first-child {
      flex: 1;
      min-width: 312px;
    }
  }

}

:deep(.tabs .t-radio-button) {
  border: none;
  padding: 0;
  margin-right: 32px;
}

:deep(.tabs .t-radio-button__label) {
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-align: left;
  color: #666666;
}

:deep(.tabs .t-is-checked .t-radio-button__label) {
  font-family: PingFang SC;
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  text-align: left;
  color: #111111;
}

:deep(.period .t-radio-button__label) {
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-align: left;
  color: #111111;
}

:deep(.period .t-is-checked .t-radio-button__label) {
  color: #003469;
}
:deep(.period .t-radio-button.t-is-checked) {
  border-color: #003469;
}

:deep(.t-range-input__inner .t-input__inner) {
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-align: left;
  color: #111111;
}
:deep(.t-range-input__inner .t-range-input__suffix) {
  display: none;
}
.cards {
  display: flex;
  justify-content: flex-start;
  margin-top: 15px;

  .bar-chart {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    margin-right: 16px;
    &:last-child {
      margin-right: 0px;
    }
  }

  .comments_option {
    width: 100%;
    padding: 16px 24px;
    // border-bottom: 1px solid #F8F8FB;

    p {
      margin-bottom: 12px;
      span {
        margin-right: 24px;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-align: left;
        color: #999999;
      }

      :deep(.t-radio) {
        border: 1px solid #ddd;
        padding: 8px 15px;
        border-radius: 3px;

        .t-radio__input {
          display: none;
        }

        .t-radio__label {
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
          text-align: left;
          color: #111111;
          margin-left: 0px;
        }
      }

      :deep(.t-is-checked) {
        border-color: #003469;
        .t-checkbox__label {
          color: #003469;
        }
      }
    }

    .t-divider {
      border-top: 1px solid #F8F8FB;
    }

    :deep(.t-tabs__nav-item.t-is-active) {
      text-shadow: none;
    }

    :deep(.t-tabs__bar) {
      background-color: transparent;
    }
    :deep(.t-tabs__nav-item-wrapper:hover) {
      background-color: transparent !important;
      transition: none !important; 
    }
    :deep(.t-tabs__nav-item .t-tabs__nav-item-wrapper:hover) {  
      background-color: transparent !important; /* 设置为透明以去掉背景效果 */  
      transition: none !important; /* 关闭动画效果 */  
    }  
    :deep(.t-tabs__nav-container.t-is-top::after) {
      background-color: #F8F8FB;
    }

    :deep(.t-tabs__nav-item), :deep(.t-tabs__nav-item-wrapper) {  
      background-color: transparent !important; /* 设置为透明以去掉背景效果 */  
      transition: none !important; /* 关闭动画效果 */  
    }

    .t-tabs__nav-item:not(.t-is-disabled):not(.t-is-active):hover .t-tabs__nav-item-wrapper {

      background-color: transparent !important;
    }
    :deep(.t-tabs__nav-item-wrapper) {
      transition: none;
      background: transparent;

      .t-tabs__nav-item-text-wrapper {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-align: left;
        color: #666666;
      }
    }
    :deep(.t-is-active) {
      .t-tabs__nav-item-text-wrapper {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        text-align: left;
        color: #111111;
      }
    }
    // :deep(.t-tabs__nav-item) {
      // width: 56px !important;
    // }
    :deep(.t-tabs__bar) {
      height: 1px;
      background-color: #003469;
    }

    .comments_analysis {
      display: flex;
      justify-content: space-between;

      .chart {
        flex: 1;
        margin-right: 16px;
      }
    }
  }
}

.compare_card {
  margin-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;

  .t-tabs {
    border-radius: 8px;
  }

  :deep(.t-tabs__nav-item.t-is-active) {
    text-shadow: none;
  }

  :deep(.t-tabs__bar) {
    background-color: transparent;
  }
  :deep(.t-tabs__nav-item-wrapper:hover) {
    background-color: transparent !important;
    transition: none !important; 
  }
  :deep(.t-tabs__nav-item .t-tabs__nav-item-wrapper:hover) {  
    background-color: transparent !important; /* 设置为透明以去掉背景效果 */  
    transition: none !important; /* 关闭动画效果 */  
  }  
  :deep(.t-tabs__nav-container.t-is-top::after) {
    background-color: #F8F8FB;
  }

  :deep(.t-tabs__nav-item), :deep(.t-tabs__nav-item-wrapper) {  
    background-color: transparent !important; /* 设置为透明以去掉背景效果 */  
    transition: none !important; /* 关闭动画效果 */  
  }

  .t-tabs__nav-item:not(.t-is-disabled):not(.t-is-active):hover .t-tabs__nav-item-wrapper {

    background-color: transparent !important;
  }
  :deep(.t-tabs__nav-item-wrapper) {
    transition: none;
    background: transparent;

    .t-tabs__nav-item-text-wrapper {
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      text-align: left;
      color: #666666;
    }
  }
  :deep(.t-is-active) {
    .t-tabs__nav-item-text-wrapper {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      text-align: left;
      color: #111111;
    }
  }
  // :deep(.t-tabs__nav-item) {
    // width: 56px !important;
  // }
  :deep(.t-tabs__bar) {
    height: 1px;
    background-color: #003469;
  }

  .compare_filter {
    padding: 20px 24px;
    display: flex;
    .compare_type {
      display: flex;
      align-items: center;

      & > div {
        margin-right: 16px;
        label {
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
          text-align: left;
          color: #666666;
        }
        .t-select__wrap {
          margin-top: 5px;
        }
      }

      :deep(.t-button) {
        margin-top: 26px;
        background: linear-gradient(0deg, #003469, #003469),
          radial-gradient(110.29% 21.62% at 50% 100%, #006FDF 0%, rgba(0, 52, 105, 0.0001) 100%);
        
        .t-button__text {
          font-family: PingFang SC;
          font-size: 11px;
          font-weight: 400;
          line-height: 12px;
          text-align: left;
          color: #FFFFFF;
        }
      }
    }
    .prd {
      flex: 1;
      margin-bottom: 0px;
      background: #F8F8FA;
      border-radius: 8px;
      margin-left: 76px;
      & > span {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-align: left;
        color: #666666;
      }

      img {
        width: 48px;
        height: 48px;
        margin-right: 12px;
      }
    }
  }

  .comparative {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 16px;

    .chart {
      flex: 1;
      margin-right: 16px;

      &:last-child {
        margin-right: 0px;
      }
    }
  }

}

.bg {
  // height:363px;
  background: #fff;
  border-radius: 8px;
}
</style>