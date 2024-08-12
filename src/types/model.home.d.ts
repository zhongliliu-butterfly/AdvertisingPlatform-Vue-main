export interface CostList {
    costList: Array<any>
    index?: number;
    name?: string;
    updateChart?: Array;
    value?: number;
    last: Last;
}
export interface Last {
    rate: string;
    value: number;
}
export interface AdList {
    labels?: Array<string>;
    name?: Array<string>;
    data?: Array<number>;
}
export interface strategyList{
    name?:string
    strategy_adopt_count?:number
    strategy_adopt_rate?:number

}
export interface ShopRankList {
    name?: string;
    value?: string;
}

export interface accountInfo{
    company_name:string;
    email:string;
    real_name:string;
    role:string;
    store_id:number;
    tenant_id:string;
    user_id:number;
}

export interface shopSelect {
    seller_id?: string;
    seller_name?: string;
    adv_manager_name?: string;
    adv_manager_id?:string|number;
    id?: string;
    user_id?:number;
    real_name?:string;
    store_id?:string|number;
    profile_id?:string;
}

export interface shopData {
    title?: string;
    avatar?: string;
    desc?: string;
}

export interface advDetail {
    strategy_id: string;
    strategy_name?: string;
    life_cycle_label?: string;
    action_name?: string;
    term_type_label?: string;
    statistic_dim?: string;
    strategy_desc?: string;
    action_recommend_date?: string;
    change_acos?: number;
    last30d_impressions?: number;
    last30d_clicks?: number;
    last30d_order_quantity?: number;
    last30d_sale_amt?: number;
    last30d_sale_amt_new?:number;
    currency_code?: string;
}

export interface treeLabel {
    label: string,
    value: string,
    children?: Array<treeLabel>
}

export interface panelModel {
    value: string,
    label: string,
    removable: boolean,
    content: advDetail,
    detail?: Array,
    oldDetail?: Array,
    campaigns_info?: Array,
    managers_info?: Array,
    parent_asin_info?: Array,
    category_info?: Array,
    formData?: selectForm,
    costData?: Array
}
export interface selectForm {
    asin: string,
    campaign_name: string,
    adv_manager_name: string,
    category_name: string
}

export interface FilterCriteria {
    asin?: string;
    campaign_name?: string;
    adv_manager_name?: string;
    category_name?: string;
    seller_name?:string;
    good_name?:string;
    department_name?:string;
    marketplace_name?:string;
    seller_name?:string;
    search_term?:string;
    word?:string;
    ad_group_name?:string;
    campaign_name_list?:string;
    orig_campaign_match_type?:string;
    new_campaign_name?:string;
    new_group_name?:string;
}

export interface DetailItem {
    good_info: { 
        asin: string,
        name:string,
       
    };
    campaign_name: string;
    adv_manager_name: string;
    category_name: string;
    adv_department_list_name:string,
    marketplace_name:string 
    seller_name:string 
}