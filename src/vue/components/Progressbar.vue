<template>
  <component :is="component" :class="c.base">
    <span
      :class="c.inner"
      :style="{ transform: `translateX(-${100 - (progress / 1) * 100}%)` }"
    />
    <slot />
  </component>
</template>
<script>
  import { computed } from 'vue';
  import { ProgressbarClasses } from '../../shared/classes/ProgressbarClasses.js';
  import { useThemeClasses } from '../shared/use-theme-classes.js';

  export default {
    name: 'k-progressbar',
    props: {
      component: {
        type: String,
        default: 'span',
      },
      colors: {
        type: Object,
      },
      ios: {
        type: Boolean,
        default: undefined,
      },
      material: {
        type: Boolean,
        default: undefined,
      },
      progress: {
        type: Number,
        default: 0,
      },
    },
    setup(props) {
      const colors = computed(() => ({
        bg: 'bg-primary',
        ...(props.colors || {}),
      }));

      const c = useThemeClasses(props, () => ProgressbarClasses(colors.value));

      return {
        c,
      };
    },
  };
</script>
