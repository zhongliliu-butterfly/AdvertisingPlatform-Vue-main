import { Directive, DirectiveBinding } from 'vue';

function changeRem() {
    const pix = window.devicePixelRatio;
    document.documentElement.style.fontSize = `${16 / pix}px`;
}

export const unscale: Directive<Element, boolean> = {
    // 在绑定元素的 attribute 前或事件监听器应用前调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    created(el, binding: DirectiveBinding) {
        if (binding.value) {
            window.addEventListener('resize', changeRem);
            changeRem();
        }
    },

    // 在元素被插入到 DOM 前调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    beforeMount(el, binding: DirectiveBinding) {},

    // 在绑定元素的父组件及他自己的所有子节点都挂载完成后调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    mounted(el, binding: DirectiveBinding) {},

    // 绑定元素的父组件更新前调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    beforeUpdate(el, binding: DirectiveBinding) {},

    // 在绑定元素的父组件及他自己的所有子节点都更新后调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    updated(el, binding: DirectiveBinding) {
        if (binding.value) {
            changeRem();
        }
    },

    // 绑定元素的父组件卸载前调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    beforeUnmount(el, binding: DirectiveBinding) {},

    // 绑定元素的父组件卸载后调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    unmounted(el, binding: DirectiveBinding) {
        if (binding.value) {
            document.documentElement.style.fontSize = '16px';
            window.removeEventListener('resize', changeRem);
        }
    },
};
