<template>
  <label class="v-checkbox" :class="{'is-disabled': disabled}">
    <input
      type="checkbox"
      :value="value"
      :disabled="disabled"
      v-model="model"
      @click="handleClick"
      v-if="isGroup"
    />
    <input
      ref="checkboxRef"
      type="checkbox"
      :true-value="value"
      :false-value="falseValue"
      :disabled="disabled"
      v-model="model"
      @click="handleClick"
      v-if="!isGroup"
    />
    <i class="v-checkbox-icon" :style="iconStyle"></i>
    <span class="v-checkbox-label">
      <slot>{{ currentLabel }}</slot>
    </span>
  </label>
</template>

<script setup>
import {computed, ref} from 'vue';

const props = defineProps({
  modelValue: {},
  value: {
    required: true,
  },
  falseValue: {
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
  },
});
const emit = defineEmits(['click', 'update:model-value']);

const checkboxRef = ref();
const model = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (!props.disabled) {
      emit('update:model-value', val);
    }
  },
});
const currentLabel = computed(() => typeof props.value === 'string' ? props.value : JSON.stringify(props.value));
const isGroup = computed(() => Array.isArray(model));
const iconStyle = computed(() => {
  if (props.disabled || !props.color) {
    return {};
  }
  let style = {borderColor: props.color};
  if (isGroup.value && model.value.includes(props.value) || model.value === props.value) {
    style.background = props.color;
  }
  return style;
});

function handleClick() {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    emit('click', model.value);
  }, 0);
}
</script>

<style lang="less">
.v-checkbox {
  --checkbox-height: 28px;
  --color-checkbox: var(--color-primary);

  position: relative;
  display: flex;
  align-items: center;
  min-height: var(--checkbox-height);
  cursor: pointer;

  &:not(.is-disabled):hover {
    .v-checkbox-icon {
      border-color: var(--color-checkbox);
    }
  }

  input[type='checkbox'] {
    position: absolute;
    z-index: -1;
    opacity: 0;

    &:checked ~ .v-checkbox-icon {
      background: var(--color-checkbox);
      border-color: var(--color-checkbox);

      &::after {
        transform: rotate(45deg) scaleY(1);
      }
    }

    &[disabled] {
      ~ .v-checkbox-icon {
        background: var(--color-bg-disabled);
        border-color: var(--color-border-disabled);
        cursor: not-allowed;
      }

      &:checked ~ .v-checkbox-icon {
        background: var(--color-bg-disabled);
      }
    }
  }

  .v-checkbox-label {
    position: relative;
    flex: 1 0 0;
    padding-left: 4px;
  }

  .v-checkbox-icon {
    width: 18px;
    height: 18px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    box-sizing: border-box;
    transition: all .2s;

    &::after {
      content: '';
      position: absolute;
      top: 8px;
      left: 6px;
      display: block;
      width: 4px;
      height: 8px;
      box-sizing: content-box;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #fff;
      transform: rotate(45deg) scaleY(0);
      transition: transform .2s cubic-bezier(.71, -.46, .88, .6) .05s
    }
  }
}
</style>