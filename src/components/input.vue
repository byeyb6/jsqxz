<template>
  <textarea
    v-if="type === 'textarea'"
    class="v-textarea"
    v-model="value"
    :disabled="disabled"
    :placeholder="placeholder"
  ></textarea>
  <div v-else class="v-input" :class="{[`is-${size}`]: sizeMap[size]}">
    <input
      class="v-input-inner"
      v-model="value"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      @click="emitEvent('click', $event)"
      @input="emitEvent('input', $event)"
      @focus="emitEvent('focus', $event)"
      @blur="emitEvent('blur', $event)"
    />
    <i class="icon-clear" v-show="value" @click="clear"></i>
  </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  type: {
    type: String,
    default: 'text',
  },
  size: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue', 'input', 'focus', 'blur', 'click', 'clear']);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (!props.disabled) {
      emit('update:modelValue', val);
    }
  },
});
const sizeMap = {
  large: true,
  small: true,
  mini: true,
};

function emitEvent(name, e) {
  emit(name, e);
}

function clear() {
  value.value = '';
  emit('clear');
}
</script>

<style lang="less">
.v-input {
  --ipt-height: var(--height-default);

  position: relative;

  .v-input-inner {
    width: 100%;
    height: var(--ipt-height);
    padding: 0 30px 0 10px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-sizing: border-box;

    &:hover {
      border-color: var(--color-border-hover);
    }

    &[disabled] {
      background: var(--color-bg-disabled);
      border-color: var(--color-border-disabled);
      color: var(--color-disabled);
      cursor: not-allowed;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }

  &.is-large {
    --ipt-height: var(--height-large);
  }

  &.is-small {
    --ipt-height: var(--height-small);
  }

  &.is-mini {
    --ipt-height: var(--height-mini);
  }

  &:hover {
    .icon-clear {
      opacity: 1;
    }
  }

  .icon-clear {
    position: absolute;
    top: 50%;
    right: 5px;
    z-index: 2;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #aaa;
    opacity: 0;
    transform: translateY(-50%);
    transition: opacity .2s;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 7px;
      display: block;
      width: 2px;
      height: 12px;
      border-radius: 1px;
      background: #fff;
      transform: rotateZ(45deg);
    }

    &::after {
      content: '';
      position: absolute;
      left: 2px;
      top: 7px;
      display: block;
      height: 2px;
      width: 12px;
      border-radius: 1px;
      background: #fff;
      transform: rotateZ(45deg);
    }
  }
}

.v-textarea {
  width: 100%;
  height: calc(var(--height-default) * 3);
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  line-height: 1.5em;
  box-sizing: border-box;
  resize: vertical;
  overflow: auto;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: var(--color-border-hover);
  }
}
</style>
