<template>
  <div>
    <div class="top-filter">
      <div class="middle-item">
        <div>
          <t-button variant="text" shape="square" @click="">
            <template #icon>
              <img width="auto" height="12" :src="WebApp.getImage('products/group.png')" alt="logo" />
            </template>
            国家/地区
          </t-button>
        </div>
        <div class="tdesign-demo-dropdown">
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
      <div class="middle-item">
        <div>
          <t-button variant="text" shape="square" @click="">
            <template #icon>
              <img width="auto" height="12" :src="WebApp.getImage('products/report.png')" alt="logo" />
            </template>
            父ASIN
          </t-button>
        </div>
        <t-input style="width: 90%; margin: 0 auto; border: none !important;" v-model="asin" placeholder="请输入父ASIN" />
      </div>
      <div class="middle-item">
        <div>
          <t-button variant="text" shape="square" @click="">
            <template #icon>
              <img width="auto" height="12" :src="WebApp.getImage('products/Shape.png')" alt="logo" />
            </template>
            评分范围
          </t-button>
        </div>
        <div>
          <t-range-input />
        </div>
      </div>
      <div class="middle-item">
        <div>
          <t-button variant="text" shape="square" @click="">
            <template #icon>
              <img width="auto" height="12" :src="WebApp.getImage('products/relation.png')" alt="logo" />
            </template>
            评价渠道
          </t-button>
        </div>

        <t-select v-model="category" value-type="object" filterable placeholder="请选择/搜索" :options="categoryList"
          @search="searchCategory" :loading="loading2" reserveKeyword
          style="width: 90%; margin: 0 auto; border: none !important;" />
      </div>
      <div class="large-item">
        <div>
          <t-button variant="text" shape="square" @click="">
            <template #icon>
              <img width="auto" height="12" :src="WebApp.getImage('products/calendar.png')" alt="logo" />
            </template>
            时间
          </t-button>
        </div>

        <t-select v-model="category" value-type="object" filterable placeholder="请选择/搜索" :options="categoryList"
          @search="searchCategory" :loading="loading2" reserveKeyword
          style="width: 90%; margin: 0 auto; border: none !important;" />
      </div>
      <img class="prd-search" :src="WebApp.getImage('common/product_search.png')" />
    </div>
    <t-tabs v-model="currTab" :default-value="1" :class="{'showTips': currTab === 1}">
      <t-tab-panel :value="1" label="全部商品">
        <t-table :style="{ width: `100%` }" row-key="pointId" :data="productLists"
            :loading="loading" :table-layout="'fixed'" :columns="columns1" :bordered="false"
            :pagination="paginationAdvice" cell-empty-content="/" @sort-change="adviceSortChange"
            :hide-sort-tips="true" @page-change="handleChangeAdvice">
            <template #total_comments_num_slot> 
              总评价量 
              <img height="8px" :src="WebApp.getImage('products/sort.png')"/>
            </template>
            <template #return_volume_slot> 
              退货量 
              <img height="8px" :src="WebApp.getImage('products/sort.png')"/>
            </template>
            <template #return_rate_slot> 
              退货率 
              <img height="8px" :src="WebApp.getImage('products/sort.png')"/>
            </template>
            <template #star_rating_slot> 
              星级评分 
              <img height="8px" :src="WebApp.getImage('products/sort.png')"/>
            </template>
            <template #product_info="{ row }">
                <div class="prd_info">
                  <img :src="WebApp.getImage(row.cover)" alt="" srcset="">
                  <div>
                    <p>
                      {{ row.title }}
                    </p>
                    <p>
                      {{ row.code }}
                      <img :src="WebApp.getImage('products/info.png')"/>
                    </p>
                  </div>
                </div>
            </template>
            <template #star_rating="{ row }">
              <t-rate v-model="row.star_rating" :count="5" size="12px" color="#FF3600" />
              <p class="start_rate">{{ row.star_rating.toFixed(1) }}</p>
            </template>
            <template #top3_positive_evaluations="{ row }">
              <div class="comments" v-for="(item, index) in row.positiveEvaluations" :key="index">
                <t-tag shape="round"  size="small" color="#FF6E00">{{(item.rate * 100).toFixed(1)}}%&nbsp;/&nbsp;{{item.count}}</t-tag>
                <p>{{item.desc}}</p>
              </div>
              <!-- <t-rate v-model="row.star_rating" :count="5" size="12px" color="#FF3600" />
              <p>{{ row.star_rating.toFixed(1) }}</p> -->
            </template>
            <template #top3_negative_evaluations="{ row }">
              <div class="comments" v-for="(item, index) in row.negativeEvaluations" :key="index">
                <t-tag shape="round" size="small" color="#358270">{{(item.rate * 100).toFixed(1)}}%&nbsp;/&nbsp;{{item.count}}</t-tag>
                <p>{{item.desc}}</p>
              </div>
              <!-- <t-rate v-model="row.star_rating" :count="5" size="12px" color="#FF3600" />
              <p>{{ row.star_rating.toFixed(1) }}</p> -->
            </template>
            <template #handle="{ row }">
              <t-button size="small" variant="text" style="color: #0073EB" @click="visible=true">
                <template #icon>
                  <img width="12px" height="12px" style="margin-right: 8px" :src="WebApp.getImage('products/line.png')" alt="" srcset="">
                </template>
                查看趋势</t-button>
              <t-button size="small" variant="text" style="color: #0073EB" @click="WebApp.toPage('/page/products/detail')">
                <template #icon>
                  <img width="12px" height="12px" style="margin-right: 8px" :src="WebApp.getImage('products/link.png')" alt="" srcset=""/>
                </template>
                链接直达</t-button>
              <t-button size="small" variant="text" style="color: #0073EB">
                <template #icon>
                  <img width="12px" height="12px" style="margin-right: 8px" :src="WebApp.getImage('products/followed.png')" alt="" srcset=""/>
                </template>
                关注商品</t-button>
              <!-- <span class="hand_detail" @click="toStragyList(row)">查看明细</span> -->
          </template>
        </t-table>
      </t-tab-panel>
      <t-tab-panel :value="2" label="我的关注">
        
      </t-tab-panel>
      <t-tab-panel :value="3" label="告警商品">
        <template #label> 告警商品  
          <img width="14px" height="13px" style="margin-left: 4px" :src="WebApp.getImage('products/alarm.png')" alt="" srcset=""/>
        </template>
        <p style="margin: 20px">选项卡3内容区</p>
      </t-tab-panel>
    </t-tabs>
    <t-dialog
      width="650px"
      :closeBtn="false"
      :footer="false" 
      v-model:visible="visible">
      <lineChart :adChart="adChart" :shopDataTime="shopDataTime" />
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import * as WebApp from '@/utils/webapp';
import { TableProps, SelectProps } from 'tdesign-vue-next';
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
import lineChart from '@/components/echarts/lineChart.vue' 
import problemAnalysis from '@/components/echarts/problemAnalysis.vue' 
const screenWidth = ref(0);
onMounted(() => {
    screenWidth.value = window.innerWidth - 305;
    console.log(screenWidth.value)
    window.addEventListener('resize', updateScreenWidth);
});
onUnmounted(() => {
    window.removeEventListener('resize', updateScreenWidth);
});
function updateScreenWidth() {
  screenWidth.value = window.innerWidth - 305;
}
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
])
const country = ref(''), countryIcon = ref('');

watch(country, (newVal) => {
  const item = countrys.value.find(v => v.content === newVal);
  countryIcon.value = item ? item.icon : ''
})
const category = ref({}), loading2 = ref(false);
const categoryList = ref<TableProps['data']>([])
const asin = ref('');
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
const currTab = ref(1);
const paginationAdvice = reactive({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 3,
    showPageSize: false,
    showPageNumber: false,
    // showPreviousAndNextBtn: false,
    theme: 'simple',
    size: 'small'
});

const handleChangeAdvice = (pageInfo: any) => {
    paginationAdvice.defaultCurrent = pageInfo.current as number;
    paginationAdvice.defaultPageSize = pageInfo.pageSize as number;
};
const columns1 = reactive([
  { colKey: 'product_info', className: 'prd_col', title: '商品信息', align: 'left', width: 278, sortType: 'all', sorter: false },
  { colKey: 'total_comments_num', className: 'comments_num', title: 'total_comments_num_slot', align: 'left', width: 120, sortType: 'all', sorter: false },
  { colKey: 'return_volume', className: 'return_volume', title: 'return_volume_slot', align: 'left', width: 120, sortType: 'all', sorter: false },
  { colKey: 'return_rate', className: 'return_rate', title: 'return_rate_slot', align: 'left', width: 120, sortType: 'all', sorter: false,
    cell: (h: any, params: { row: any }) => {
      const { row } = params;
      return (row.return_rate * 100).toFixed(1) + '%';
    }
  },
  { colKey: 'star_rating', title: 'star_rating_slot', align: 'left', width: 120, sortType: 'all', sorter: false },
  { colKey: 'top3_positive_evaluations', title: 'Top3正向评价', align: 'left', width: 226, sortType: 'all', sorter: false },
  { colKey: 'top3_negative_evaluations', title: 'Top3负向评价', align: 'left', width: 226, sortType: 'all', sorter: false },
  { colKey: 'handle', title: '操作', align: 'left', width: 120, sortType: 'all', sorter: false },
]);
const productLists = ref([
  {
    title: 'Under Armour 安德瑪 男款 Tech Golf Polo 衫',
    cover: 'products/prd_1.png',
    code: 'BK87539234',
    total_comments_num: 3,
    return_volume: 4,
    return_rate: 0.03,
    star_rating: 4,
    top3_positive_evaluations: 'bfdbdbd',
    top3_negative_evaluations: 'tbgfbgf',
    positiveEvaluations: [
      {
        desc: '材质柔软不伤皮肤不…',
        rate: 0.02,
        count: 26
      },{
        desc: '易清洗、易干燥',
        rate: 0.014,
        count: 13
      }, {
        desc: '做工好',
        rate: 0.008,
        count: 9
      }
    ],
    negativeEvaluations: [
      {
        desc: '材质柔软不伤皮肤不…',
        rate: 0.02,
        count: 26
      },{
        desc: '易清洗、易干燥',
        rate: 0.014,
        count: 13
      }, {
        desc: '做工好',
        rate: 0.008,
        count: 9
      }
    ]
  }, {
    title: 'Under Armour 安德瑪 男款 Tech Golf Polo 衫',
    cover: 'products/prd_2.png',
    code: 'BK87539234',
    total_comments_num: 3,
    return_volume: 4,
    return_rate: 0.03,
    star_rating: 2,
    top3_positive_evaluations: 'bfdbdbd',
    top3_negative_evaluations: 'tbgfbgf',
    positiveEvaluations: [
      {
        desc: '材质柔软不伤皮肤不…',
        rate: 0.02,
        count: 26
      },{
        desc: '易清洗、易干燥',
        rate: 0.014,
        count: 13
      }, {
        desc: '做工好',
        rate: 0.008,
        count: 9
      }
    ],
    negativeEvaluations: [
      {
        desc: '材质柔软不伤皮肤不…',
        rate: 0.02,
        count: 26
      },{
        desc: '易清洗、易干燥',
        rate: 0.014,
        count: 13
      }, {
        desc: '做工好',
        rate: 0.008,
        count: 9
      }
    ]
  }, {
    title: 'Under Armour 安德瑪 男款 Tech Golf Polo 衫',
    cover: 'products/prd_3.png',
    code: 'BK87539234',
    total_comments_num: 3,
    return_volume: 4,
    return_rate: 0.03,
    star_rating: 5,
    top3_positive_evaluations: 'bfdbdbd',
    top3_negative_evaluations: 'tbgfbgf',
    positiveEvaluations: [
      {
        desc: '材质柔软不伤皮肤不…',
        rate: 0.02,
        count: 26
      },{
        desc: '易清洗、易干燥',
        rate: 0.014,
        count: 13
      }, {
        desc: '做工好',
        rate: 0.008,
        count: 9
      }
    ],
    negativeEvaluations: [
      {
        desc: '颜色与描述不符',
        rate: 0.232,
        count: 296
      },{
        desc: '材质透明',
        rate: 0.156,
        count: 168
      }, {
        desc: '材质偏薄',
        rate: 0.089,
        count: 98
      }
    ]
  }
]);
//  rgb(255, 54, 0)
const visible = ref(false);
const adChart = ref({
  title: "评论趋势",
  series: {
    positiveComments: {
      name: '正向',
      color: 'rgb(30, 189, 161)',
      highColor: 'rgba(30, 189, 161, 0.8)',
      lowColor: 'rgba(30, 189, 161, 0)',
      data: [890, 1463, 1643, 1344, 2032, 2055, 2534, 1843]
    },
    negativeComments: {
      name: '负向',
      color: 'rgb(255, 54, 0)',
      highColor: 'rgba(255, 54, 0, 0.8)',
      lowColor: 'rgba(255, 54, 0, 0)',
      data: [1890, 1463, 643, 544, 2032, 3055, 1534, 1343]
    },
  },
  labels: ['07/01', '07/02', '07/03', '07/04', '07/05', '07/06', '07/07']
});
const shopDataTime = ref('')
/*
*/
</script>


<style lang="less" scoped>
.top-filter {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  padding: 0px 0 16px;

  .middle-item {
    width: 136px;
    height: 114px;
    background: #fff;
    border-radius: 4px;
    margin-left: 16px;
    flex: 1;

    &:hover {
      box-shadow: 2px 2px 8px #bebebe,
        -2px -2px 8px #ffffff;
    }

    &:first-child {
      margin-left: 0px;
    }

    div {
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid#F7F7FA;
    }

    :deep(.t-input),
    :deep(.t-range-input) {
      border: none;
    }

    :deep(.t-input:hover),
    :deep(.t-input--focused),
    :deep(.t-range-input.t-is-focused) {
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

  .large-item {
    width: 256px;
    height: 114px;
    background: #fff;
    border-radius: 4px;
    margin-left: 16px;
    flex: 2;

    &:hover {
      box-shadow: 2px 2px 8px #bebebe,
        -2px -2px 8px #ffffff;
    }

    div {
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
    }
  }

  .prd-search {
    margin-left: 16px;
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

:deep(.t-tabs) {
  border-radius: 4px;

  .t-tabs__nav-scroll {
    // padding: 6px 15px 0px;
    // height: 75px;
    padding-left: 9px;
  }
}

:deep(.t-tabs__nav-item.t-size-m) {
  height: 69px;
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

:deep(.t-tabs__nav-item), :deep(.t-tabs__nav-item-wrapper) {  
  background-color: transparent !important; /* 设置为透明以去掉背景效果 */  
  transition: none !important; /* 关闭动画效果 */  
}

.t-tabs__nav-item:not(.t-is-disabled):not(.t-is-active):hover .t-tabs__nav-item-wrapper {

  background-color: transparent !important;
}

:deep(.t-is-active) {
  .t-tabs__nav-item-text-wrapper {
    color: #111111;
    font-size: 18px;
    font-weight: 600;
  }
}

:deep(.showTips .t-tabs__nav-container::before) {
  content: "全部商品会在此展示，点击关注商品，该商品会归纳到我的关注，告警商品会被标为红色";
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-align: right;
  color: #AAAAAA;
  position: absolute;
  top: 50%;
  height:12px;
  right: 30px;
  transform: translateY(-50%);
}

:deep(.t-tabs__nav-container.t-is-top::after) {
  background-color: transparent !important;
}

:deep(.t-table th) {
  padding: 10px 24px !important;
  background: #F8F8FB !important;
  border: none !important;
}

:deep(.t-table td) {
  padding: 18px 24px !important;
}

:deep(.t-table__th-cell-inner) {
  font-size: 12px !important;
  line-height: 12px !important;
  color: #999999;
  font-family: PingFang SC;
  font-weight: 400;
  text-align: left;
  display: flex;
  align-items: center;

  img {
    margin-left: 3px;
  }
}

:deep(.t-table__body td) {
  vertical-align: top !important;
}

.prd_info {
  display: flex;
  img {
    width: 72px;
    height: 72px;
    margin-right: 12px;
  }
  p {
    font: PingFang SC;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    color: #111111;

    &:last-child {
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
}

:deep(.t-table__row--hover:hover .prd_info p:first-child) {
  color: #D40000;
}

:deep(.comments_num) {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  text-align: left;
  color: #999999;
}

:deep(.return_volume) {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  text-align: left;
  color: #111111;
}

:deep(.return_rate) {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  text-align: left;
  color: #FF3600;
}

:deep(.comments) {
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-align: left;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }
  p {
    flex: 1;
    color: #666666;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
    height: 12px;
    text-align: left;
    margin-bottom: 0;
    margin-left: 10px;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
  }
}

:deep(.start_rate) {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  text-align: left;
  color: #111111;
  margin: 6px 0 0;
}

.cards {
  display: flex;
  justify-content: space-evenly;
}
</style>