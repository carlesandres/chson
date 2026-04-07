import * as ResizablePrimitive from 'react-resizable-panels';
declare const ResizablePanelGroup: ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => import("react/jsx-runtime").JSX.Element;
declare const ResizablePanel: import("react").ForwardRefExoticComponent<Omit<import("react").HTMLAttributes<HTMLDivElement | HTMLElement | HTMLParagraphElement | HTMLHeadingElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableRowElement | HTMLTableCellElement | HTMLTableCaptionElement | HTMLFormElement | HTMLSpanElement | HTMLAnchorElement | HTMLPreElement | HTMLButtonElement | HTMLObjectElement | HTMLMapElement | HTMLSlotElement | HTMLStyleElement | HTMLTitleElement | HTMLLinkElement | HTMLDialogElement | HTMLImageElement | HTMLOptionElement | HTMLLabelElement | HTMLDetailsElement | HTMLDataElement | HTMLInputElement | HTMLLIElement | HTMLOListElement | HTMLSelectElement | HTMLUListElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLCanvasElement | HTMLTableColElement | HTMLDataListElement | HTMLModElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLHeadElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement | HTMLLegendElement | HTMLMetaElement | HTMLMeterElement | HTMLOptGroupElement | HTMLOutputElement | HTMLProgressElement | HTMLScriptElement | HTMLSourceElement | HTMLTemplateElement | HTMLTextAreaElement | HTMLTimeElement | HTMLTrackElement | HTMLVideoElement | HTMLMenuElement | HTMLPictureElement>, "id" | "onResize"> & {
    className?: string | undefined;
    collapsedSize?: number | undefined;
    collapsible?: boolean | undefined;
    defaultSize?: number | undefined;
    id?: string | undefined;
    maxSize?: number | undefined;
    minSize?: number | undefined;
    onCollapse?: ResizablePrimitive.PanelOnCollapse | undefined;
    onExpand?: ResizablePrimitive.PanelOnExpand | undefined;
    onResize?: ResizablePrimitive.PanelOnResize | undefined;
    order?: number | undefined;
    style?: object | undefined;
    tagName?: keyof HTMLElementTagNameMap | undefined;
} & {
    children?: import("react").ReactNode;
} & import("react").RefAttributes<ResizablePrimitive.ImperativePanelHandle>>;
declare const ResizableHandle: ({ withHandle, className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
    withHandle?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
//# sourceMappingURL=resizable.d.ts.map