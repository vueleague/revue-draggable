import type { DraggableCoreProps } from '../utils/types';
import { computed, defineComponent, isVue3, onBeforeUnmount, onMounted, PropType, ref } from 'vue-demi';
import useDraggableCore from '../hooks/useDraggableCore';
import { DefineComponent } from 'vue';
import { DraggableProps } from '../utils/types';
import { isVNode } from '../utils/shims';

let DraggableCore: DefineComponent<Partial<DraggableCoreProps>> = defineComponent({
  template: "<div>Can't use me in Vue2</div>"
});

if (isVue3) {
  DraggableCore = defineComponent({
    name: 'DraggableCore',
    props: {
      scale: {
        type: Number as PropType<DraggableCoreProps['scale']>,
        default: 1
      },
      allowAnyClick: {
        type: Boolean as PropType<DraggableCoreProps['allowAnyClick']>,
        default: true
      },
      disabled: {
        type: Boolean as PropType<DraggableCoreProps['disabled']>,
        default: false
      },
      enableUserSelectHack: {
        type: Boolean as PropType<DraggableCoreProps['enableUserSelectHack']>,
        default: true
      },
      onStart: {
        type: Function as PropType<DraggableCoreProps['onStart']>,
        default: () => {}
      },
      onDrag: {
        type: Function as PropType<DraggableCoreProps['onDrag']>,
        default: () => {}
      },
      onStop: {
        type: Function as PropType<DraggableCoreProps['onStop']>,
        default: () => {}
      },
      onMouseDown: {
        type: Function as PropType<DraggableCoreProps['onMouseDown']>,
        default: () => {}
      },
      cancel: {
        type: String as PropType<DraggableCoreProps['cancel']>,
        default: undefined
      },
      offsetParent: {
        type: Object as PropType<DraggableCoreProps['offsetParent']>,
        default: undefined
      },
      grid: {
        type: Array as unknown as PropType<DraggableCoreProps['grid']>,
        default: undefined
      },
      handle: {
        type: String as PropType<DraggableCoreProps['handle']>,
        default: undefined
      },
      nodeRef: {
        type: Object as PropType<DraggableProps['nodeRef']>,
        default: undefined
      }
    },
    setup(props, { slots }) {
      const nodeRef = ref<HTMLElement | null>(props.nodeRef ?? null);
      const draggable = computed(() => {
        const node = nodeRef.value && isVNode(nodeRef.value) ? (nodeRef.value as any).$el : nodeRef.value;
        return (
          node &&
          useDraggableCore({
            ...(props as DraggableCoreProps),
            nodeRef: node
          })
        );
      });
      onMounted(() => {
        draggable.value?.onMounted();
      });
      onBeforeUnmount(() => {
        draggable.value?.onBeforeUnmount();
      });

      return () => (
        <>
          {slots.default
            ? slots
                .default()
                .map((node) => (
                  <node
                    ref={nodeRef}
                    onMousedown={draggable.value?.onMouseDown}
                    onMouseUp={draggable.value?.onMouseUp}
                    onTouchend={draggable.value?.onTouchEnd}
                  />
                ))
            : []}
        </>
      );
    }
  }) as DefineComponent<Partial<DraggableCoreProps>>;
}

export default DraggableCore;