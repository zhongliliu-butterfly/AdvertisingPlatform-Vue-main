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
          <t-dropdown trigger="click" @click="">
            <t-button variant="text">
              <span class="tdesign-demo-dropdown__text">
                请选择
              </span>
              <template #suffix>
                <img width="auto" height="6" :src="WebApp.getImage('products/down.png')" alt="logo" />
              </template>
            </t-button>
            <t-dropdown-menu style="width: 100%">
              <t-dropdown-item style="width: 100%" v-for="item in countrys" :key="item.value" :value="item.value">
                <img width="auto" height="12" :src="WebApp.getImage(item.icon)" alt="logo" />
                {{ item.content }}
              </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
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
    <t-tabs>
      <t-tab-panel :value="1" label="全部商品">

      <t-table :style="{ width: `${screenWidth}px` }" row-key="pointId" :data="adviceTableList"
          :loading="loading" :table-layout="'fixed'" :columns="columnsAdvice" :bordered="false"
          :pagination="paginationAdvice" cell-empty-content="/" @sort-change="adviceSortChange"
          :hide-sort-tips="true" @page-change="handleChangeAdvice">
          <template #action_name="{ row }">
              <div class="table-name">
                  <div class="table-title">
                      <p class="tooltip-text" :title="row.action_name"> {{
                          row.action_name }} </p>
                      <span class="tip-primary">{{ row.action_term }}</span>
                  </div>
                  <p>统计粒度：{{ row.statistic_dim }}</p>
              </div>
          </template>
          <template #handle="{ row }">
            <span class="hand_detail" @click="toStragyList(row)">查看明细</span>
        </template>
      </t-table>
      </t-tab-panel>
      <t-tab-panel :value="2" label="我的关注">
        <p style="margin: 20px">选项卡2内容区</p>
      </t-tab-panel>
      <t-tab-panel :value="3" label="告警商品">
        <p style="margin: 20px">选项卡3内容区</p>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script setup lang="ts">
import * as WebApp from '@/utils/webapp';
import { TableProps, SelectProps } from 'tdesign-vue-next';
import { ref, onMounted, onUnmounted, reactive } from 'vue';
// 
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
const countrys = ref([{
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
}])
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


const columns1 = reactive([
  { colKey: 'total_comments_num', title: '总评价量', align: 'center', width: 120, sortType: 'all', sorter: true },
  { colKey: 'return_volume', title: '退货量', align: 'center', width: 120, sortType: 'all', sorter: true },
  { colKey: 'return_rate', title: '退货率', align: 'center', width: 120, sortType: 'all', sorter: true },
]);
/**/
</script>


<style lang="less" scoped>
.top-filter {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  padding: 10px 0 20px;

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

    :deep(.t-input) {
      border: none;
    }

    :deep(.t-input:hover),
    :deep(.t-input--focused) {
      appearance: none;
      box-shadow: none;
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
    padding: 6px 15px 0px;
    // height: 75px;
  }
}

:deep(.t-tabs__nav-item.t-size-m) {
  height: 69px;
}

:deep(.t-tabs__bar) {
  background-color: transparent;
}

:deep(.t-tabs__nav-item-wrapper:hover) {
  background-color: transparent !important;
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

.t-tabs__nav-container.t-is-top::after {
  background-color: transparent !important;
}
</style>