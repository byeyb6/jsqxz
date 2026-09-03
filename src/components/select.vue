<template>
  <div class="v-select" ref="selectRef">
    <!-- 输入框区域 -->
    <div class="select-input" @click="handleToggle">
      <input
        v-model="keyword"
        class="select-input__inner"
        :placeholder="placeholder"
        @input="handleFilter"
      />
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </div>

    <!-- 下拉面板 -->
    <div v-if="isOpen" class="select-dropdown">
      <div v-if="filterOptions.length === 0" class="dropdown-empty">无匹配选项</div>
      <div
        v-for="item of filterOptions"
        :key="item.value"
        class="dropdown-item"
        :class="{ active: modelValue === item.value }"
        @click="handleSelect(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted, useTemplateRef} from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
});

const emit = defineEmits(['update:modelValue']);

const selectRef = useTemplateRef('selectRef');
const isOpen = ref(false);
const keyword = ref('');
const optionLength = computed(() => Math.min(6, filterOptions.value.length));

// 筛选后的选项
const filterOptions = computed(() => {
  if (!keyword.value) {
    return props.options;
  }
  return props.options.filter(item => new RegExp(keyword.value, 'i').test(item.label));
});

// 根据value回填显示文本
const getLabelByValue = val => {
  const found = props.options.find(o => o.value === val);
  return found ? found.label : '';
};

watch(() => props.modelValue, newVal => {
  // 外部修改v‑model时同步显示文本
  keyword.value = getLabelByValue(newVal);
}, {immediate: true});

// 切换下拉展开收起
const handleToggle = () => {
  if (isOpen.value) {
    keyword.value = getLabelByValue(props.modelValue);
    isOpen.value = false;
  } else {
    keyword.value = '';
    isOpen.value = true;
  }
};

// 输入筛选
const handleFilter = () => {
  if (!isOpen.value) {
    isOpen.value = true;
  }
};

// 选中某一项
const handleSelect = item => {
  emit('update:modelValue', item.value);
  keyword.value = item.label;
  isOpen.value = false;
};

// 点击空白关闭下拉
const handleDocumentClick = e => {
  if (!selectRef.value) {
    return;
  }
  if (!selectRef.value.contains(e.target)) {
    isOpen.value = false;
    keyword.value = getLabelByValue(props.modelValue);
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style lang="less">
.v-select {
  --select-height: var(--height-default);
  --option-height: var(--height-default);

  position: relative;
  width: 100%;
  font-size: 14px;

  .select-input {
    display: flex;
    align-items: center;
    height: var(--select-height);
    padding: 0 10px;
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      border-color: #94a3b8;
    }
  }

  .select-input__inner {
    flex: 1;
    border: none;
    outline: none;
    font-size: inherit;
    background: transparent;
  }

  .arrow {
    font-size: 12px;
    color: #6b7280;
    transition: all 0.2s;

    &.open {
      transform: rotate(180deg);
    }
  }

  .select-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    z-index: 99;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    overflow: auto;
    max-height: calc(var(--option-height) * 6);
    transition: all 0.2s;
  }

  .dropdown-item {
    height: var(--option-height);
    line-height: var(--option-height);
    padding: 0 10px;
    cursor: pointer;

    &:hover {
      background-color: var(--color-bg-hover);
    }

    &.active {
      color: var(--color-primary);
    }
  }

  .dropdown-empty {
    height: var(--option-height);
    line-height: var(--option-height);
    padding: 0 10px;
    color: var(--color-disabled);
  }
}
</style>