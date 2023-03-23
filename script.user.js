// ==UserScript==
// @name        improved lightbox for cohost
// @namespace   https://easrng.net
// @match       https://cohost.org/*
// @grant       none
// @version     1.16
// @author      easrng
// @description 2/23/2023, 6:13:44 AM
// @run-at      document-start
// @downloadURL https://easrng.github.io/improved-cohost-lightbox/script.user.js
// ==/UserScript==

(function() {
    function vendor() {

    };
    const realDefineProperty = Object.defineProperty.bind(Object)
    Object.defineProperty = function(object, key, descriptor) {
        return realDefineProperty(object, key, {...descriptor,
            configurable: typeof descriptor.configurable === "boolean" ? descriptor.configurable : key !== "prototype"
        })
    }
    window.addEventListener("load", async(e) => {
        vendor.call(window)
        if (!window.__LOADABLE_LOADED_CHUNKS__) {
            console.log("no __LOADABLE_LOADED_CHUNKS__")
            return
        }
        window.__LOADABLE_LOADED_CHUNKS__.push([
            [1818587769], {
                1818587769: (module, exports, require) => {
                    const findLoadedModules = (check) =>
                        window.__LOADABLE_LOADED_CHUNKS__
                        .map((e) => Object.keys(e[1]))
                        .flat()
                        .map((e) => require(e))
                        .filter(check);
                    const React = findLoadedModules(
                        (e) => e && e.createElement && e.useState
                    )[0];
                    const html = htm.bind(React.createElement)
                    const ReactDOM = findLoadedModules(
                        (e) => e && e.render && e.createPortal
                    )[0];
                    window.process = window.process || {};
                    window.process.env = window.process.env || {};
                    const lightbox = findLoadedModules(
                        (e) =>
                        typeof e === "object" &&
                        Object.values(e).find(
                            (e) =>
                            typeof e === "function" &&
                            e.toString().includes("lightbox-container")
                        )
                    )[0];
                    const useLightboxKey = Object.entries(lightbox).find(
                        (e) =>
                        typeof e[1] === "function" &&
                        e[1].toString().includes("useContext") &&
                        !e[1].toString().includes("lightbox-container")
                    )[0];
                    const LightboxHostKey = Object.entries(lightbox).find(
                        (e) =>
                        typeof e[1] === "function" &&
                        e[1].toString().includes("lightbox-container")
                    )[0];
                    let Lightbox;
                    const realUseContext = React.useContext;
                    React.useContext = (l) => l;
                    Lightbox = lightbox[useLightboxKey]();
                    React.useContext = realUseContext;
                    function Slides({content, closeLightbox, carouselIndex}) {
                      const swiperElRef = React.useRef(null);
                      React.useEffect(() => {
                        const swiper = swiperElRef.current
                        swiper.shadowRoot.appendChild(Object.assign(document.createElement("style"), {textContent:`
                        .swiper-button-next,
                        .swiper-button-prev,
                        .swiper-pagination {
                          opacity:var(--easrng-swiper-controls,1)
                        }
                        .swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled {
                          opacity:var(--easrng-swiper-controls,0.35);
                          pointer-events: initial;
                        }
                        .swiper-button-next,
                        .swiper-button-prev {
                          width: 15%;
                          --swiper-navigation-sides-offset: 0;
                          --swiper-navigation-size: 100vh;
                        }
                        .swiper-button-next::after, .swiper-button-prev::after {
                          font-size: 3rem;
                        }
                        `}))
                        swiper.swiper.slideTo(carouselIndex, 0)
                      }, [])
                      const [hideControls, setHideControls] = React.useState(false)
                      return html`
                        <swiper-container ref=${swiperElRef} navigation="true" pagination="true" keyboard="true" class="fixed inset-0 z-30 bg-notBlack bg-opacity-90 backdrop-blur" style=${{"--swiper-theme-color":"rgb(var(--color-accent))","--swiper-pagination-bullet-inactive-color":"rgb(var(--color-notWhite))", "--easrng-swiper-controls": hideControls? "0":undefined}}>
                          <div slot="container-start" class="fixed bottom-4 right-4 z-20">
                            <svg viewBox="0 0 25 18" xmlns="http://www.w3.org/2000/svg" class="cohost-shadow-light dark:cohost-shadow-dark inline-block h-8 cursor-pointer fill-composeButton text-text hover:fill-text hover:text-composeButton ${hideControls? "invisible":""}" role="button" tabindex="0" onClick=${()=>closeLightbox()}>
                              <path d="M14.923 17.087c-2.254.666-4.388.967-6.402.905-2.014-.062-3.742-.532-5.183-1.409-1.442-.877-2.436-2.217-2.982-4.022-.549-1.814-.463-3.476.257-4.985.719-1.51 1.905-2.832 3.557-3.965C5.823 2.478 7.776 1.578 10.03.913c2.243-.663 4.369-.965 6.376-.906 2.007.059 3.733.523 5.178 1.394 1.446.87 2.441 2.207 2.987 4.011.546 1.804.457 3.464-.266 4.981-.724 1.516-1.908 2.845-3.551 3.987-1.644 1.143-3.588 2.045-5.831 2.707Z"/>
                              <g transform-origin="center center" transform="scale(0.8 0.8) rotate(0)">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </g>
                            </svg>
                          </div>
                          ${content.map(e=>html`
                          <swiper-slide key=${e.attachmentId}>
                            <img onClick=${() => setHideControls(!hideControls)} src=${e.fileURL} alt=${e.altText} style=${{width: "100%", height: "100%", objectFit: "contain"}}/>
                          </swiper-slide>`)}
                        </swiper-container>`
                    }
                    Object.defineProperty(lightbox, LightboxHostKey, {
                        value: ({
                            children,
                            ...props
                        }) => {
                            const [isOpen, setIsOpen] = React.useState(false);
                            const [visiblePostId, setVisiblePostId] = React.useState(0);
                            const [lightboxContent, setLightboxContent] = React.useState({});
                            const [carouselIndex, setCarouselIndex] = React.useState(0);
                            const modalContainer = React.useRef();
                            React.useEffect(() => {
                                let el = document.getElementById("lightbox-container");
                                if (!el) {
                                    el = document.createElement("div");
                                    el.id = "lightbox-container";
                                    document.body.appendChild(el);
                                }
                                modalContainer.current = el;
                                const onPopState = e => {
                                    setIsOpen(history.state && history.state.lightboxOpen)
                                }
                                window.addEventListener("popstate", onPopState)
                                const onKeyDown = e => {
                                    if(e.key === "Escape" && history.state.lightboxOpen) {
                                        event.preventDefault()
                                        setIsOpen(false)
                                    }
                                }
                                window.addEventListener("keydown", onKeyDown)
                                return () => {
                                    window.removeEventListener("popstate", onPopState)
                                    window.removeEventListener("keydown", onKeyDown)
                                }
                            });
                            React.useEffect(() => {
                              if(isOpen) {
                                if(!(history.state && history.state.lightboxOpen)) {
                                  history.pushState({lightboxOpen:true}, "", "#lightbox")
                                }
                              } else {
                                if(history.state && history.state.lightboxOpen) {
                                  history.back()
                                }
                              }
                            }, [isOpen])
                            const openLightbox = (postId, index = 0) => {
                                setVisiblePostId(postId);
                                setCarouselIndex(index);
                                setIsOpen(true);
                            };
                            const closeLightbox = () => {
                                setIsOpen(false);
                            };
                            const setLightboxContentForPost = (postId, content) => {
                                if (lightboxContent[postId]) return;
                                lightboxContent[postId] = content;
                                setLightboxContent(lightboxContent);
                            };
                            const content = ((lightboxContent[visiblePostId] === null || lightboxContent[visiblePostId] === undefined) ? [] : lightboxContent[visiblePostId]).map(e=>e.attachment)
                            return React.createElement(
                                React.Fragment,
                                null,
                                React.createElement(
                                    Lightbox.Provider, {
                                        value: {
                                            openLightbox,
                                            closeLightbox,
                                            setLightboxContentForPost,
                                        },
                                    },
                                    children
                                ),
                                isOpen && modalContainer.current ?
                                ReactDOM.createPortal(
                                    html`<${Slides} ...${{content, closeLightbox, carouselIndex, setCarouselIndex}} />`,
                                    modalContainer.current
                                ) :
                                null
                            );
                        },
                    });
                    const appRoot = document.getElementById("app");
                    const container = appRoot[Object.keys(appRoot).find(e=>e.startsWith("__reactContainer"))];
                    ReactDOM.render(container.memoizedState.element, appRoot);
                },
            },
            (r) => r(1818587769),
        ])
    });
})()
