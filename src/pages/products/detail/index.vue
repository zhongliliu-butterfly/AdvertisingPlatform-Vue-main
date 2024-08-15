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
            类目
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
          <t-rate v-model="product.star_rating" :count="5" size="12px" color="#FF3600" />
          <span class="start_rate">{{ product.star_rating.toFixed(1) }}</span>

          <p>{{ product.comments }}条评价</p>
          <p>{{ product.returnVolumnComments }}条退货评价</p>
        </div>
      </div>
      <img class="btn" :src="WebApp.getImage('products/follow_btn.png')" />
      <img class="btn view_voice" :src="WebApp.getImage('products/view_voices.png')" />
    </div>
    <t-space>
      <t-radio-group class="tabs" v-model="curTabs" default-value="1">
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
    <div class="cards bg">

    </div>
  </div>
</template>

<script setup lang="ts">
import * as WebApp from '@/utils/webapp';
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
import problemAnalysis from '@/components/echarts/problemAnalysis.vue'
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

const curTabs = ref('2');
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
      }
    }
  }

  .btn {
    width: 120px;
    height: 40px;
  }

  .view_voice {
    margin-right: 50px;
  }
}

:deep(.t-space) {
  display: flex;
  justify-content: space-between;

  .t-space-item:first-child {
    flex: 1;
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
}

.bg {
  background: #fff;
  border-radius: 8px;
  flex: 1;
}
</style>