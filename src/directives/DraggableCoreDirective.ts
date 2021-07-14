import { Directive, DirectiveHook, isVue3 } from 'vue-demi';
import { DraggableCoreProps, EventHandler, useDraggableCore } from '../index';

const draggableCoreDirective: DirectiveHook<HTMLElement, any, DraggableCoreProps> = (el, binding) => {
  const draggable = useDraggableCore(el, binding.value);
  el.onmousedown = draggable.onMouseDown as EventHandler<MouseEvent>;
  el.onmouseup = draggable.onMouseUp as EventHandler<MouseEvent>;
  el.ontouchend = draggable.onTouchEnd as EventHandler<TouchEvent>;
  el.dispatchEvent(new CustomEvent('draggableCore', { detail: draggable }));
  draggable.onMounted();
};
const DraggableCoreDirective: Directive<HTMLElement, DraggableCoreProps> = {
  [isVue3 ? 'mounted' : 'inserted']: draggableCoreDirective
};

export default DraggableCoreDirective;