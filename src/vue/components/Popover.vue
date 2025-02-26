<template>
  <div v-if="backdrop" :class="c.backdrop[state]" @click="onBackdropClick" />
  <component :is="component" ref="elRef" :style="popoverStyle" :class="classes">
    <div
      v-if="theme === 'ios'"
      ref="angleElRef"
      :style="angleStyle"
      :class="c.angleWrap[positions.anglePosition]"
    >
      <div :class="c.angleArrow[positions.anglePosition]" />
    </div>
    <div :class="c.inner"><slot /></div>
  </component>
</template>
<script>
  /* eslint-disable no-restricted-globals */
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
  import { cls } from '../../shared/cls.js';
  import { useThemeClasses } from '../shared/use-theme-classes.js';
  import { useTheme } from '../shared/use-theme.js';
  import { calcPopoverPosition } from '../../shared/calc-popover-position.js';
  import { useDarkClasses } from '../shared/use-dark-classes.js';
  import { PopoverClasses } from '../../shared/classes/PopoverClasses.js';

  export default {
    name: 'k-popover',
    props: {
      component: {
        type: String,
        default: 'div',
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
      size: { type: String, default: 'w-64' },
      opened: Boolean,
      backdrop: { type: Boolean, default: true },
      angleClass: { type: String, default: '' },
      target: { type: [Object, String], default: undefined },
      targetX: { type: Number, default: undefined },
      targetY: { type: Number, default: undefined },
      targetWidth: { type: Number, default: undefined },
      targetHeight: { type: Number, default: undefined },
      translucent: { type: Boolean, default: true },
    },
    emits: ['backdropclick'],
    setup(props, ctx) {
      const elRef = ref(null);
      const angleElRef = ref(null);
      const positions = ref({
        set: false,
        angleTop: 0,
        angleLeft: 0,
        anglePosition: 'bottom',
        popoverTop: 0,
        popoverLeft: 0,
        popoverPosition: 'top-left',
      });
      const theme = useTheme(props);

      const state = computed(() => (props.opened ? 'opened' : 'closed'));

      const colors = computed(() => ({
        bg: cls('bg-popover-light', useDarkClasses('dark:bg-popover-dark')),
        ...(props.colors || {}),
      }));

      const c = useThemeClasses(props, () =>
        PopoverClasses(props, colors.value, ctx.attrs.class)
      );

      const setPopover = () => {
        if (!props.target || !elRef.value || !props.opened) return;
        positions.value = calcPopoverPosition({
          popoverEl: elRef.value,
          targetEl: props.target,
          angleEl: angleElRef.value,
          theme: theme.value,
          targetX: props.targetX,
          targetY: props.targetY,
          targetWidth: props.targetWidth,
          targetHeight: props.targetHeight,
        });
      };

      const attachEvents = () => {
        if (typeof window === 'undefined') return;
        window.addEventListener('resize', setPopover);
      };

      const detachEvents = () => {
        if (typeof window === 'undefined') return;
        window.removeEventListener('resize', setPopover);
      };

      onMounted(() => {
        attachEvents();
        if (props.opened) setPopover();
      });
      onBeforeUnmount(() => {
        detachEvents();
      });

      watch(
        () => props.opened,
        () => setPopover()
      );

      const onBackdropClick = (e) => {
        ctx.emit('backdropclick', e);
      };

      const popoverStyle = computed(() =>
        positions.value.set
          ? {
              left: positions.value.popoverLeft,
              top: positions.value.popoverTop,
            }
          : {}
      );

      const angleStyle = computed(() =>
        positions.value.set
          ? {
              left: positions.value.angleLeft,
              top: positions.value.angleTop,
            }
          : undefined
      );

      const originClasses = {
        'top-right': 'origin-bottom-left',
        'top-left': 'origin-bottom-right',
        'middle-left': 'origin-right',
        'middle-right': 'origin-left',
        'bottom-right': 'origin-top-left',
        'bottom-left': 'origin-top-right',
      };
      const classes = computed(() =>
        cls(
          c.value.base[state.value],
          theme.value === 'material' &&
            originClasses[positions.value.popoverPosition],
          ctx.attrs.class
        )
      );

      return {
        onBackdropClick,
        c,
        state,
        elRef,
        angleElRef,
        classes,
        popoverStyle,
        angleStyle,
        positions,
        theme,
      };
    },
  };
</script>
