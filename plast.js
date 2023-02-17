! function(b) {
    function d(a) {
        return (a || "").toLowerCase()
    }
    b.fn.cycle = function(a) {
        var e;
        return 0 !== this.length || b.isReady ? this.each(function() {
            var c, e, g, l, f = b(this),
                k = b.fn.cycle.log;
            if (!f.data("cycle.opts")) {
                (!1 === f.data("cycle-log") || a && !1 === a.log || e && !1 === e.log) && (k = b.noop);
                k("--c2 init--");
                c = f.data();
                for (var m in c) c.hasOwnProperty(m) && /^cycle[A-Z]+/.test(m) && (l = c[m], g = m.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, d), k(g + ":", l, "(" + typeof l + ")"), c[g] = l);
                e = b.extend({}, b.fn.cycle.defaults, c, a || {});
                e.timeoutId =
                    0;
                e.paused = e.paused || !1; 
                e.container = f;
                e._maxZ = e.maxZ;
                e.API = b.extend({
                    _container: f
                }, b.fn.cycle.API);
                e.API.log = k;
                e.API.trigger = function(c, a) {
                    return e.container.trigger(c, a), e.API
                };
                f.data("cycle.opts", e);
                f.data("cycle.API", e.API);
                e.API.trigger("cycle-bootstrap", [e, e.API]);
                e.API.addInitialSlides();
                e.API.preInitSlideshow();
                e.slides.length && e.API.initSlideshow()
            }
        }) : (e = {
            s: this.selector,
            c: this.context
        }, b.fn.cycle.log("requeuing slideshow (dom not ready)"), b(function() {
            b(e.s, e.c).cycle(a)
        }), this)
    };
    b.fn.cycle.API = {
        opts: function() {
            return this._container.data("cycle.opts")
        },
        addInitialSlides: function() {
            var a = this.opts(),
                e = a.slides;
            a.slideCount = 0;
            a.slides = b();
            e = e.jquery ? e : a.container.find(e);
            a.random && e.sort(function() {
                return Math.random() - .5
            });
            a.API.add(e)
        },
        preInitSlideshow: function() {
            var a = this.opts();
            a.API.trigger("cycle-pre-initialize", [a]);
            var e = b.fn.cycle.transitions[a.fx];
            e && b.isFunction(e.preInit) && e.preInit(a);
            a._preInitialized = !0
        },
        postInitSlideshow: function() {
            var a = this.opts();
            a.API.trigger("cycle-post-initialize",
                [a]);
            var e = b.fn.cycle.transitions[a.fx];
            e && b.isFunction(e.postInit) && e.postInit(a)
        },
        initSlideshow: function() {
            var a, e = this.opts(),
                c = e.container;
            e.API.calcFirstSlide();
            "static" == e.container.css("position") && e.container.css("position", "relative");
            b(e.slides[e.currSlide]).css({
                opacity: 1,
                display: "block",
                visibility: "visible"
            });
            e.API.stackSlides(e.slides[e.currSlide], e.slides[e.nextSlide], !e.reverse);
            e.pauseOnHover && (!0 !== e.pauseOnHover && (c = b(e.pauseOnHover)), c.hover(function() {
                e.API.pause(!0)
            }, function() {
                e.API.resume(!0)
            }));
            e.timeout && (a = e.API.getSlideOpts(e.currSlide), e.API.queueTransition(a, a.timeout + e.delay));
            e._initialized = !0;
            e.API.updateView(!0);
            e.API.trigger("cycle-initialized", [e]);
            e.API.postInitSlideshow()
        },
        pause: function(a) {
            var e = this.opts(),
                c = e.API.getSlideOpts(),
                h = e.hoverPaused || e.paused;
            a ? e.hoverPaused = !0 : e.paused = !0;
            h || (e.container.addClass("cycle-paused"), e.API.trigger("cycle-paused", [e]).log("cycle-paused"), c.timeout && (clearTimeout(e.timeoutId), e.timeoutId = 0, e._remainingTimeout -= b.now() - e._lastQueue, (0 >
                e._remainingTimeout || isNaN(e._remainingTimeout)) && (e._remainingTimeout = void 0)))
        },
        resume: function(a) {
            var e = this.opts(),
                c = !e.hoverPaused && !e.paused;
            a ? e.hoverPaused = !1 : e.paused = !1;
            c || (e.container.removeClass("cycle-paused"), 0 === e.slides.filter(":animated").length && e.API.queueTransition(e.API.getSlideOpts(), e._remainingTimeout), e.API.trigger("cycle-resumed", [e, e._remainingTimeout]).log("cycle-resumed"))
        },
        add: function(a, e) {
            var c, h = this.opts(),
                d = h.slideCount,
                l = !1;
            "string" == b.type(a) && (a = b.trim(a));
            b(a).each(function() {
                var c,
                    a = b(this);
                e ? h.container.prepend(a) : h.container.append(a);
                h.slideCount++;
                c = h.API.buildSlideOpts(a);
                h.slides = e ? b(a).add(h.slides) : h.slides.add(a);
                h.API.initSlide(c, a, --h._maxZ);
                a.data("cycle.opts", c);
                h.API.trigger("cycle-slide-added", [h, c, a])
            });
            h.API.updateView(!0);
            (l = h._preInitialized && 2 > d && 1 <= h.slideCount) && (h._initialized ? h.timeout && (c = h.slides.length, h.nextSlide = h.reverse ? c - 1 : 1, h.timeoutId || h.API.queueTransition(h)) : h.API.initSlideshow())
        },
        calcFirstSlide: function() {
            var a, e = this.opts();
            a = parseInt(e.startingSlide ||
                0, 10);
            (a >= e.slides.length || 0 > a) && (a = 0);
            e.currSlide = a;
            e.reverse ? (e.nextSlide = a - 1, 0 > e.nextSlide && (e.nextSlide = e.slides.length - 1)) : (e.nextSlide = a + 1, e.nextSlide == e.slides.length && (e.nextSlide = 0))
        },
        calcNextSlide: function() {
            var a, e = this.opts();
            e.reverse ? (a = 0 > e.nextSlide - 1, e.nextSlide = a ? e.slideCount - 1 : e.nextSlide - 1, e.currSlide = a ? 0 : e.nextSlide + 1) : (a = e.nextSlide + 1 == e.slides.length, e.nextSlide = a ? 0 : e.nextSlide + 1, e.currSlide = a ? e.slides.length - 1 : e.nextSlide - 1)
        },
        calcTx: function(a, e) {
            var c;
            return a._tempFx ? c = b.fn.cycle.transitions[a._tempFx] :
                e && a.manualFx && (c = b.fn.cycle.transitions[a.manualFx]), c || (c = b.fn.cycle.transitions[a.fx]), a._tempFx = null, this.opts()._tempFx = null, c || (c = b.fn.cycle.transitions.fade, a.API.log('Transition "' + a.fx + '" not found.  Using fade.')), c
        },
        prepareTx: function(a, e) {
            var c, b, d, l, f, k = this.opts();
            return 2 > k.slideCount ? void(k.timeoutId = 0) : (!a || k.busy && !k.manualTrump || (k.API.stopTransition(), k.busy = !1, clearTimeout(k.timeoutId), k.timeoutId = 0), void(k.busy || (0 !== k.timeoutId || a) && (b = k.slides[k.currSlide], d = k.slides[k.nextSlide],
                l = k.API.getSlideOpts(k.nextSlide), f = k.API.calcTx(l, a), k._tx = f, a && void 0 !== l.manualSpeed && (l.speed = l.manualSpeed), k.nextSlide != k.currSlide && (a || !k.paused && !k.hoverPaused && k.timeout) ? (k.API.trigger("cycle-before", [l, b, d, e]), f.before && f.before(l, b, d, e), c = function() {
                        k.busy = !1;
                        k.container.data("cycle.opts") && (f.after && f.after(l, b, d, e), k.API.trigger("cycle-after", [l, b, d, e]), k.API.queueTransition(l), k.API.updateView(!0))
                    }, k.busy = !0, f.transition ? f.transition(l, b, d, e, c) : k.API.doTransition(l, b, d, e, c), k.API.calcNextSlide(),
                    k.API.updateView()) : k.API.queueTransition(l))))
        },
        doTransition: function(a, e, c, h, d) {
            var l = b(e),
                f = b(c),
                k = function() {
                    f.animate(a.animIn || {
                        opacity: 1
                    }, a.speed, a.easeIn || a.easing, d)
                };
            f.css(a.cssBefore || {});
            l.animate(a.animOut || {}, a.speed, a.easeOut || a.easing, function() {
                l.css(a.cssAfter || {});
                a.sync || k()
            });
            a.sync && k()
        },
        queueTransition: function(a, e) {
            var c = this.opts(),
                h = void 0 !== e ? e : a.timeout;
            return 0 === c.nextSlide && 0 === --c.loop ? (c.API.log("terminating; loop=0"), c.timeout = 0, h ? setTimeout(function() {
                c.API.trigger("cycle-finished",
                    [c])
            }, h) : c.API.trigger("cycle-finished", [c]), void(c.nextSlide = c.currSlide)) : void 0 !== c.continueAuto && (!1 === c.continueAuto || b.isFunction(c.continueAuto) && !1 === c.continueAuto()) ? (c.API.log("terminating automatic transitions"), c.timeout = 0, void(c.timeoutId && clearTimeout(c.timeoutId))) : void(h && (c._lastQueue = b.now(), void 0 === e && (c._remainingTimeout = a.timeout), c.paused || c.hoverPaused || (c.timeoutId = setTimeout(function() {
                c.API.prepareTx(!1, !c.reverse)
            }, h))))
        },
        stopTransition: function() {
            var a = this.opts();
            a.slides.filter(":animated").length &&
                (a.slides.stop(!1, !0), a.API.trigger("cycle-transition-stopped", [a]));
            a._tx && a._tx.stopTransition && a._tx.stopTransition(a)
        },
        advanceSlide: function(a) {
            var e = this.opts();
            return clearTimeout(e.timeoutId), e.timeoutId = 0, e.nextSlide = e.currSlide + a, 0 > e.nextSlide ? e.nextSlide = e.slides.length - 1 : e.nextSlide >= e.slides.length && (e.nextSlide = 0), e.API.prepareTx(!0, 0 <= a), !1
        },
        buildSlideOpts: function(a) {
            var e, c, h = this.opts();
            a = a.data() || {};
            for (var g in a) a.hasOwnProperty(g) && /^cycle[A-Z]+/.test(g) && (e = a[g], c = g.match(/^cycle(.*)/)[1].replace(/^[A-Z]/,
                d), h.API.log("[" + (h.slideCount - 1) + "]", c + ":", e, "(" + typeof e + ")"), a[c] = e);
            a = b.extend({}, b.fn.cycle.defaults, h, a);
            a.slideNum = h.slideCount;
            try {
                delete a.API, delete a.slideCount, delete a.currSlide, delete a.nextSlide, delete a.slides
            } catch (l) {}
            return a
        },
        getSlideOpts: function(a) {
            var e = this.opts();
            void 0 === a && (a = e.currSlide);
            a = b(e.slides[a]).data("cycle.opts");
            return b.extend({}, e, a)
        },
        initSlide: function(a, e, c) {
            var h = this.opts();
            e.css(a.slideCss || {});
            0 < c && e.css("zIndex", c);
            isNaN(a.speed) && (a.speed = b.fx.speeds[a.speed] ||
                b.fx.speeds._default);
            a.sync || (a.speed /= 2);
            e.addClass(h.slideClass)
        },
        updateView: function(a, e) {
            var c = this.opts();
            if (c._initialized) {
                var b = c.API.getSlideOpts(),
                    d = c.slides[c.currSlide];
                !a && !0 !== e && (c.API.trigger("cycle-update-view-before", [c, b, d]), 0 > c.updateView) || (c.slideActiveClass && c.slides.removeClass(c.slideActiveClass).eq(c.currSlide).addClass(c.slideActiveClass), a && c.hideNonActive && c.slides.filter(":not(." + c.slideActiveClass + ")").css("visibility", "hidden"), 0 === c.updateView && setTimeout(function() {
                    c.API.trigger("cycle-update-view",
                        [c, b, d, a])
                }, b.speed / (c.sync ? 2 : 1)), 0 !== c.updateView && c.API.trigger("cycle-update-view", [c, b, d, a]), a && c.API.trigger("cycle-update-view-after", [c, b, d]))
            }
        },
        getComponent: function(a) {
            var e = this.opts();
            a = e[a];
            return "string" == typeof a ? /^\s*[\>|\+|~]/.test(a) ? e.container.find(a) : b(a) : a.jquery ? a : b(a)
        },
        stackSlides: function(a, e, c) {
            var h = this.opts();
            a || (a = h.slides[h.currSlide], e = h.slides[h.nextSlide], c = !h.reverse);
            b(a).css("zIndex", h.maxZ);
            a = h.maxZ - 2;
            var d = h.slideCount;
            if (c) {
                for (c = h.currSlide + 1; d > c; c++) b(h.slides[c]).css("zIndex",
                    a--);
                for (c = 0; c < h.currSlide; c++) b(h.slides[c]).css("zIndex", a--)
            } else {
                for (c = h.currSlide - 1; 0 <= c; c--) b(h.slides[c]).css("zIndex", a--);
                for (c = d - 1; c > h.currSlide; c--) b(h.slides[c]).css("zIndex", a--)
            }
            b(e).css("zIndex", h.maxZ - 1)
        },
        getSlideIndex: function(a) {
            return this.opts().slides.index(a)
        }
    };
    b.fn.cycle.log = function() {
        window.console && console.log && console.log("[cycle2] " + Array.prototype.join.call(arguments, " "))
    };
    b.fn.cycle.version = function() {
        return "Cycle2: 2.1.5"
    };
    b.fn.cycle.transitions = {
        custom: {},
        none: {
            before: function(a,
                e, c, b) {
                a.API.stackSlides(c, e, b);
                a.cssBefore = {
                    opacity: 1,
                    visibility: "visible",
                    display: "block"
                }
            }
        },
        fade: {
            before: function(a, e, c, h) {
                var d = a.API.getSlideOpts(a.nextSlide).slideCss || {};
                a.API.stackSlides(e, c, h);
                a.cssBefore = b.extend(d, {
                    opacity: 0,
                    visibility: "visible",
                    display: "block"
                });
                a.animIn = {
                    opacity: 1
                };
                a.animOut = {
                    opacity: 0
                }
            }
        },
        fadeout: {
            before: function(a, e, c, h) {
                var d = a.API.getSlideOpts(a.nextSlide).slideCss || {};
                a.API.stackSlides(e, c, h);
                a.cssBefore = b.extend(d, {
                    opacity: 1,
                    visibility: "visible",
                    display: "block"
                });
                a.animOut = {
                    opacity: 0
                }
            }
        },
        scrollHorz: {
            before: function(a, e, c, b) {
                a.API.stackSlides(e, c, b);
                e = a.container.css("overflow", "hidden").width();
                a.cssBefore = {
                    left: b ? e : -e,
                    top: 0,
                    opacity: 1,
                    visibility: "visible",
                    display: "block"
                };
                a.cssAfter = {
                    zIndex: a._maxZ - 2,
                    left: 0
                };
                a.animIn = {
                    left: 0
                };
                a.animOut = {
                    left: b ? -e : e
                }
            }
        }
    };
    b.fn.cycle.defaults = {
        allowWrap: !0,
        autoSelector: ".cycle-slideshow[data-cycle-auto-init!=false]",
        delay: 0,
        easing: null,
        fx: "fade",
        hideNonActive: !0,
        loop: 0,
        manualFx: void 0,
        manualSpeed: void 0,
        manualTrump: !0,
        maxZ: 100,
        pauseOnHover: !1,
        reverse: !1,
        slideActiveClass: "cycle-slide-active",
        slideClass: "cycle-slide",
        slideCss: {
            position: "absolute",
            top: 0,
            left: 0
        },
        slides: "> img",
        speed: 500,
        startingSlide: 0,
        sync: !0,
        timeout: 4E3,
        updateView: 0
    };
    b(document).ready(function() {
        b(b.fn.cycle.defaults.autoSelector).cycle()
    })
}(jQuery);
(function(b) {
    function d(c, e) {
        var d, f = e.autoHeight;
        "container" == f ? (d = b(e.slides[e.currSlide]).outerHeight(), e.container.height(d)) : e._autoHeightRatio ? e.container.height(e.container.width() / e._autoHeightRatio) : ("calc" === f || "number" == b.type(f) && 0 <= f) && (d = "calc" === f ? a(c, e) : f >= e.slides.length ? 0 : f, d != e._sentinelIndex) && (e._sentinelIndex = d, e._sentinel && e._sentinel.remove(), d = b(e.slides[d].cloneNode(!0)), d.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"), d.css({
            position: "static",
            visibility: "hidden",
            display: "block"
        }).prependTo(e.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"), d.find("*").css("visibility", "hidden"), e._sentinel = d)
    }

    function a(c, a) {
        var e = 0,
            d = -1;
        return a.slides.each(function(c) {
            var a = b(this).height();
            a > d && (d = a, e = c)
        }), e
    }

    function e(c, a, e, d) {
        c = b(d).outerHeight();
        a.container.animate({
            height: c
        }, a.autoHeightSpeed, a.autoHeightEasing)
    }

    function c(a, g) {
        g._autoHeightOnResize && (b(window).off("resize orientationchange", g._autoHeightOnResize),
            g._autoHeightOnResize = null);
        g.container.off("cycle-slide-added cycle-slide-removed", d);
        g.container.off("cycle-destroyed", c);
        g.container.off("cycle-before", e);
        g._sentinel && (g._sentinel.remove(), g._sentinel = null)
    }
    b.extend(b.fn.cycle.defaults, {
        autoHeight: 0,
        autoHeightSpeed: 250,
        autoHeightEasing: null
    });
    b(document).on("cycle-initialized", function(a, g) {
        function l() {
            d(a, g)
        }
        var f, k = g.autoHeight,
            m = b.type(k),
            n = null;
        "string" !== m && "number" !== m || (g.container.on("cycle-slide-added cycle-slide-removed", d), g.container.on("cycle-destroyed",
            c), "container" == k ? g.container.on("cycle-before", e) : "string" === m && /\d+\:\d+/.test(k) && (f = k.match(/(\d+)\:(\d+)/), f = f[1] / f[2], g._autoHeightRatio = f), "number" !== m && (g._autoHeightOnResize = function() {
            clearTimeout(n);
            n = setTimeout(l, 50)
        }, b(window).on("resize orientationchange", g._autoHeightOnResize)), setTimeout(l, 30))
    })
})(jQuery);
(function(b) {
    b.extend(b.fn.cycle.defaults, {
        caption: "> .cycle-caption",
        captionTemplate: "{{slideNum}} / {{slideCount}}",
        overlay: "> .cycle-overlay",
        overlayTemplate: "<div>{{title}}</div><div>{{desc}}</div>",
        captionModule: "caption"
    });
    b(document).on("cycle-update-view", function(d, a, e, c) {
        "caption" === a.captionModule && b.each(["caption", "overlay"], function() {
            var b = e[this + "Template"],
                d = a.API.getComponent(this);
            d.length && b ? (d.html(a.API.tmpl(b, e, a, c)), d.show()) : d.hide()
        })
    });
    b(document).on("cycle-destroyed", function(d,
        a) {
        var e;
        b.each(["caption", "overlay"], function() {
            var c = a[this + "Template"];
            a[this] && c && (e = a.API.getComponent("caption"), e.empty())
        })
    })
})(jQuery);
(function(b) {
    var d = b.fn.cycle;
    b.fn.cycle = function(a) {
        var e, c, h, g = b.makeArray(arguments);
        return "number" == b.type(a) ? this.cycle("goto", a) : "string" == b.type(a) ? this.each(function() {
            var l;
            return e = a, h = b(this).data("cycle.opts"), void 0 === h ? void d.log('slideshow must be initialized before sending commands; "' + e + '" ignored') : (e = "goto" == e ? "jump" : e, c = h.API[e], b.isFunction(c) ? (l = b.makeArray(g), l.shift(), c.apply(h.API, l)) : void d.log("unknown command: ", e))
        }) : d.apply(this, arguments)
    };
    b.extend(b.fn.cycle, d);
    b.extend(d.API, {
        next: function() {
            var a = this.opts();
            if (!a.busy || a.manualTrump) {
                var e = a.reverse ? -1 : 1;
                !1 === a.allowWrap && a.currSlide + e >= a.slideCount || (a.API.advanceSlide(e), a.API.trigger("cycle-next", [a]).log("cycle-next"))
            }
        },
        prev: function() {
            var a = this.opts();
            if (!a.busy || a.manualTrump) {
                var e = a.reverse ? 1 : -1;
                !1 === a.allowWrap && 0 > a.currSlide + e || (a.API.advanceSlide(e), a.API.trigger("cycle-prev", [a]).log("cycle-prev"))
            }
        },
        destroy: function() {
            this.stop();
            var a = this.opts(),
                e = b.isFunction(b._data) ? b._data : b.noop;
            clearTimeout(a.timeoutId);
            a.timeoutId = 0;
            a.API.stop();
            a.API.trigger("cycle-destroyed", [a]).log("cycle-destroyed");
            a.container.removeData();
            e(a.container[0], "parsedAttrs", !1);
            a.retainStylesOnDestroy || (a.container.removeAttr("style"), a.slides.removeAttr("style"), a.slides.removeClass(a.slideActiveClass));
            a.slides.each(function() {
                b(this).removeData();
                e(this, "parsedAttrs", !1)
            })
        },
        jump: function(a, e) {
            var c, b = this.opts();
            if (!b.busy || b.manualTrump) {
                c = parseInt(a, 10);
                if (isNaN(c) || 0 > c || c >= b.slides.length) return void b.API.log("goto: invalid slide index: " +
                    c);
                if (c == b.currSlide) return void b.API.log("goto: skipping, already on slide", c);
                b.nextSlide = c;
                clearTimeout(b.timeoutId);
                b.timeoutId = 0;
                b.API.log("goto: ", c, " (zero-index)");
                c = b.currSlide < b.nextSlide;
                b._tempFx = e;
                b.API.prepareTx(!0, c)
            }
        },
        stop: function() {
            var a = this.opts(),
                e = a.container;
            clearTimeout(a.timeoutId);
            a.timeoutId = 0;
            a.API.stopTransition();
            a.pauseOnHover && (!0 !== a.pauseOnHover && (e = b(a.pauseOnHover)), e.off("mouseenter mouseleave"));
            a.API.trigger("cycle-stopped", [a]).log("cycle-stopped")
        },
        reinit: function() {
            var a =
                this.opts();
            a.API.destroy();
            a.container.cycle()
        },
        remove: function(a) {
            for (var e, c, d = this.opts(), g = [], l = 1, f = 0; f < d.slides.length; f++) e = d.slides[f], f == a ? c = e : (g.push(e), b(e).data("cycle.opts").slideNum = l, l++);
            c && (d.slides = b(g), d.slideCount--, b(c).remove(), a == d.currSlide ? d.API.advanceSlide(1) : a < d.currSlide ? d.currSlide-- : d.currSlide++, d.API.trigger("cycle-slide-removed", [d, a, c]).log("cycle-slide-removed"), d.API.updateView())
        }
    });
    b(document).on("click.cycle", "[data-cycle-cmd]", function(a) {
        a.preventDefault();
        a = b(this);
        var e = a.data("cycle-cmd"),
            c = a.data("cycle-context") || ".cycle-slideshow";
        b(c).cycle(e, a.data("cycle-arg"))
    })
})(jQuery);
(function(b) {
    function d(a, e) {
        var c;
        return a._hashFence ? void(a._hashFence = !1) : (c = window.location.hash.substring(1), void a.slides.each(function(d) {
            if (b(this).data("cycle-hash") == c) {
                if (!0 === e) a.startingSlide = d;
                else {
                    var g = a.currSlide < d;
                    a.nextSlide = d;
                    a.API.prepareTx(!0, g)
                }
                return !1
            }
        }))
    }
    b(document).on("cycle-pre-initialize", function(a, e) {
        d(e, !0);
        e._onHashChange = function() {
            d(e, !1)
        };
        b(window).on("hashchange", e._onHashChange)
    });
    b(document).on("cycle-update-view", function(a, e, c) {
        c.hash && "#" + c.hash != window.location.hash &&
            (e._hashFence = !0, window.location.hash = c.hash)
    });
    b(document).on("cycle-destroyed", function(a, e) {
        e._onHashChange && b(window).off("hashchange", e._onHashChange)
    })
})(jQuery);
(function(b) {
    b.extend(b.fn.cycle.defaults, {
        loader: !1
    });
    b(document).on("cycle-bootstrap", function(d, a) {
        function e(e, d) {
            function l(e) {
                var h;
                "wait" == a.loader ? (k.push(e), 0 === n && (k.sort(f), c.apply(a.API, [k, d]), a.container.removeClass("cycle-loading"))) : (h = b(a.slides[a.currSlide]), c.apply(a.API, [e, d]), h.show(), a.container.removeClass("cycle-loading"))
            }

            function f(c, a) {
                return c.data("index") - a.data("index")
            }
            var k = [];
            if ("string" == b.type(e)) e = b.trim(e);
            else if ("array" === b.type(e))
                for (var m = 0; m < e.length; m++) e[m] =
                    b(e[m])[0];
            e = b(e);
            var n = e.length;
            n && (e.css("visibility", "hidden").appendTo("body").each(function(e) {
                var h = 0,
                    f = b(this),
                    m = f.is("img") ? f : f.find("img");
                return f.data("index", e), m = m.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'), m.length ? (h = m.length, void m.each(function() {
                        if (this.complete) 0 === --h && (--n, l(f));
                        else b(this).load(function() {
                            0 === --h && (--n, l(f))
                        }).on("error", function() {
                            0 === --h && (a.API.log("slide skipped; img not loaded:", this.src), 0 === --n && "wait" == a.loader && c.apply(a.API, [k, d]))
                        })
                    })) :
                    (--n, void k.push(f))
            }), n && a.container.addClass("cycle-loading"))
        }
        var c;
        a.loader && (c = a.API.add, a.API.add = e)
    })
})(jQuery);
(function(b) {
    function d(a, c, d) {
        var g;
        a.API.getComponent("pager").each(function() {
            var l = b(this);
            if (c.pagerTemplate) {
                var f = a.API.tmpl(c.pagerTemplate, c, a, d[0]);
                g = b(f).appendTo(l)
            } else g = l.children().eq(a.slideCount - 1);
            g.on(a.pagerEvent, function(c) {
                a.pagerEventBubble || c.preventDefault();
                a.API.page(l, c.currentTarget)
            })
        })
    }

    function a(a, c) {
        var b = this.opts();
        if (!b.busy || b.manualTrump) {
            var d = a.children().index(c),
                l = b.currSlide < d;
            b.currSlide != d && (b.nextSlide = d, b._tempFx = b.pagerFx, b.API.prepareTx(!0, l), b.API.trigger("cycle-pager-activated",
                [b, a, c]))
        }
    }
    b.extend(b.fn.cycle.defaults, {
        pager: "> .cycle-pager",
        pagerActiveClass: "cycle-pager-active",
        pagerEvent: "click.cycle",
        pagerEventBubble: void 0,
        pagerTemplate: "<span>&bull;</span>"
    });
    b(document).on("cycle-bootstrap", function(a, c, b) {
        b.buildPagerLink = d
    });
    b(document).on("cycle-slide-added", function(b, c, d, g) {
        c.pager && (c.API.buildPagerLink(c, d, g), c.API.page = a)
    });
    b(document).on("cycle-slide-removed", function(a, c, d) {
        c.pager && c.API.getComponent("pager").each(function() {
            var c = b(this);
            b(c.children()[d]).remove()
        })
    });
    b(document).on("cycle-update-view", function(a, c) {
        var d;
        c.pager && (d = c.API.getComponent("pager"), d.each(function() {
            b(this).children().removeClass(c.pagerActiveClass).eq(c.currSlide).addClass(c.pagerActiveClass)
        }))
    });
    b(document).on("cycle-destroyed", function(a, c) {
        var b = c.API.getComponent("pager");
        b && (b.children().off(c.pagerEvent), c.pagerTemplate && b.empty())
    })
})(jQuery);
(function(b) {
    b.extend(b.fn.cycle.defaults, {
        next: "> .cycle-next",
        nextEvent: "click.cycle",
        disabledClass: "disabled",
        prev: "> .cycle-prev",
        prevEvent: "click.cycle",
        swipe: !1
    });
    b(document).on("cycle-initialized", function(b, a) {
        if (a.API.getComponent("next").on(a.nextEvent, function(c) {
                c.preventDefault();
                a.API.next()
            }), a.API.getComponent("prev").on(a.prevEvent, function(c) {
                c.preventDefault();
                a.API.prev()
            }), a.swipe) {
            var e = a.swipeVert ? "swipeDown.cycle" : "swipeRight.cycle swiperight.cycle";
            a.container.on(a.swipeVert ?
                "swipeUp.cycle" : "swipeLeft.cycle swipeleft.cycle",
                function() {
                    a._tempFx = a.swipeFx;
                    a.API.next()
                });
            a.container.on(e, function() {
                a._tempFx = a.swipeFx;
                a.API.prev()
            })
        }
    });
    b(document).on("cycle-update-view", function(b, a) {
        if (!a.allowWrap) {
            var e = a.disabledClass,
                c = a.API.getComponent("next"),
                h = a.API.getComponent("prev"),
                g = a._prevBoundry || 0;
            a.currSlide == (void 0 !== a._nextBoundry ? a._nextBoundry : a.slideCount - 1) ? c.addClass(e).prop("disabled", !0) : c.removeClass(e).prop("disabled", !1);
            a.currSlide === g ? h.addClass(e).prop("disabled",
                !0) : h.removeClass(e).prop("disabled", !1)
        }
    });
    b(document).on("cycle-destroyed", function(b, a) {
        a.API.getComponent("prev").off(a.nextEvent);
        a.API.getComponent("next").off(a.prevEvent);
        a.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")
    })
})(jQuery);
(function(b) {
    b.extend(b.fn.cycle.defaults, {
        progressive: !1
    });
    b(document).on("cycle-pre-initialize", function(d, a) {
        if (a.progressive) {
            var e, c, h = a.API,
                g = h.next,
                l = h.prev,
                f = h.prepareTx,
                k = b.type(a.progressive);
            if ("array" == k) e = a.progressive;
            else if (b.isFunction(a.progressive)) e = a.progressive(a);
            else if ("string" == k) {
                if (c = b(a.progressive), e = b.trim(c.html()), !e) return;
                if (/^(\[)/.test(e)) try {
                    e = b.parseJSON(e)
                } catch (m) {
                    return void h.log("error parsing progressive slides", m)
                } else e = e.split(new RegExp(c.data("cycle-split") ||
                    "\n")), e[e.length - 1] || e.pop()
            }
            f && (h.prepareTx = function(c, b) {
                var d, h;
                return c || 0 === e.length ? void f.apply(a.API, [c, b]) : void(b && a.currSlide == a.slideCount - 1 ? (h = e[0], e = e.slice(1), a.container.one("cycle-slide-added", function(c, a) {
                    setTimeout(function() {
                        a.API.advanceSlide(1)
                    }, 50)
                }), a.API.add(h)) : b || 0 !== a.currSlide ? f.apply(a.API, [c, b]) : (d = e.length - 1, h = e[d], e = e.slice(0, d), a.container.one("cycle-slide-added", function(c, a) {
                    setTimeout(function() {
                        a.currSlide = 1;
                        a.API.advanceSlide(-1)
                    }, 50)
                }), a.API.add(h, !0)))
            });
            g && (h.next = function() {
                var c = this.opts();
                if (e.length && c.currSlide == c.slideCount - 1) {
                    var a = e[0];
                    e = e.slice(1);
                    c.container.one("cycle-slide-added", function(c, a) {
                        g.apply(a.API);
                        a.container.removeClass("cycle-loading")
                    });
                    c.container.addClass("cycle-loading");
                    c.API.add(a)
                } else g.apply(c.API)
            });
            l && (h.prev = function() {
                var c = this.opts();
                if (e.length && 0 === c.currSlide) {
                    var a = e.length - 1,
                        b = e[a];
                    e = e.slice(0, a);
                    c.container.one("cycle-slide-added", function(c, a) {
                        a.currSlide = 1;
                        a.API.advanceSlide(-1);
                        a.container.removeClass("cycle-loading")
                    });
                    c.container.addClass("cycle-loading");
                    c.API.add(b, !0)
                } else l.apply(c.API)
            })
        }
    })
})(jQuery);
(function(b) {
    b.extend(b.fn.cycle.defaults, {
        tmplRegex: "{{((.)?.*?)}}"
    });
    b.extend(b.fn.cycle.API, {
        tmpl: function(d, a) {
            var e = new RegExp(a.tmplRegex || b.fn.cycle.defaults.tmplRegex, "g"),
                c = b.makeArray(arguments);
            return c.shift(), d.replace(e, function(a, e) {
                var d, f, k, m, n = e.split(".");
                for (d = 0; d < c.length; d++)
                    if (k = c[d]) {
                        if (1 < n.length)
                            for (m = k, f = 0; f < n.length; f++) k = m, m = m[n[f]] || e;
                        else m = k[e];
                        if (b.isFunction(m)) return m.apply(k, c);
                        if (void 0 !== m && null !== m && m != e) return m
                    } return e
            })
        }
    })
})(jQuery);
(function(b) {
    b.event.special.swipe = b.event.special.swipe || {
        scrollSupressionThreshold: 10,
        durationThreshold: 1E3,
        horizontalDistanceThreshold: 30,
        verticalDistanceThreshold: 75,
        setup: function() {
            var d = b(this);
            d.on("bind", "touchstart", function(a) {
                function e(a) {
                    if (g) {
                        var e = a.originalEvent.touches ? a.originalEvent.touches[0] : a;
                        c = {
                            time: (new Date).getTime(),
                            coords: [e.pageX, e.pageY]
                        };
                        Math.abs(g.coords[0] - c.coords[0]) > b.event.special.swipe.scrollSupressionThreshold && a.preventDefault()
                    }
                }
                var c, h = a.originalEvent.touches ?
                    a.originalEvent.touches[0] : a,
                    g = {
                        time: (new Date).getTime(),
                        coords: [h.pageX, h.pageY],
                        origin: b(a.target)
                    };
                d.on("bind", "touchmove", e).one("touchend", function() {
                    d.unbind("touchmove", e);
                    g && c && c.time - g.time < b.event.special.swipe.durationThreshold && Math.abs(g.coords[0] - c.coords[0]) > b.event.special.swipe.horizontalDistanceThreshold && Math.abs(g.coords[1] - c.coords[1]) < b.event.special.swipe.verticalDistanceThreshold && g.origin.trigger("swipe").trigger(g.coords[0] > c.coords[0] ? "swipeleft" : "swiperight");
                    g = c = void 0
                })
            })
        }
    };
    b.event.special.swipeleft = b.event.special.swipeleft || {
        setup: function() {
            b(this).bind("swipe", b.noop)
        }
    };
    b.event.special.swiperight = b.event.special.swiperight || b.event.special.swipeleft
})(jQuery);
(function(b) {
    b(document).on("cycle-bootstrap", function(b, a, e) {
        "carousel" === a.fx && (e.getSlideIndex = function(c) {
            var a = this.opts()._carouselWrap.children();
            return a.index(c) % a.length
        }, e.next = function() {
            var c = a.reverse ? -1 : 1;
            !1 === a.allowWrap && a.currSlide + c > a.slideCount - a.carouselVisible || (a.API.advanceSlide(c), a.API.trigger("cycle-next", [a]).log("cycle-next"))
        })
    });
    b.fn.cycle.transitions.carousel = {
        preInit: function(d) {
            d.hideNonActive = !1;
            d.container.on("cycle-destroyed", b.proxy(this.onDestroy, d.API));
            d.API.stopTransition =
                this.stopTransition;
            for (var a = 0; d.startingSlide > a; a++) d.container.append(d.slides[0])
        },
        postInit: function(d) {
            var a, e, c, h;
            a = d.carouselVertical;
            var g = d.carouselVisible || d.slides.length;
            e = {
                display: a ? "block" : "inline-block",
                position: "static"
            };
            if (d.container.css({
                    position: "relative",
                    overflow: "hidden"
                }), d.slides.css(e), d._currSlide = d.currSlide, h = b('<div class="cycle-carousel-wrap"></div>').prependTo(d.container).css({
                    margin: 0,
                    padding: 0,
                    top: 0,
                    left: 0,
                    position: "absolute"
                }).append(d.slides), d._carouselWrap = h,
                a || h.css("white-space", "nowrap"), !1 !== d.allowWrap) {
                for (e = 0;
                    (void 0 === d.carouselVisible ? 2 : 1) > e; e++) {
                    for (a = 0; d.slideCount > a; a++) h.append(d.slides[a].cloneNode(!0));
                    for (a = d.slideCount; a--;) h.prepend(d.slides[a].cloneNode(!0))
                }
                h.find(".cycle-slide-active").removeClass("cycle-slide-active");
                d.slides.eq(d.startingSlide).addClass("cycle-slide-active")
            }
            d.pager && !1 === d.allowWrap && (c = d.slideCount - g, b(d.pager).children().filter(":gt(" + c + ")").hide());
            d._nextBoundry = d.slideCount - d.carouselVisible;
            this.prepareDimensions(d)
        },
        prepareDimensions: function(d) {
            var a, e, c, h = d.carouselVertical;
            e = d.carouselVisible || d.slides.length;
            if (d.carouselFluid && d.carouselVisible ? d._carouselResizeThrottle || this.fluidSlides(d) : d.carouselVisible && d.carouselSlideDimension ? (a = e * d.carouselSlideDimension, d.container[h ? "height" : "width"](a)) : d.carouselVisible && (a = e * b(d.slides[0])[h ? "outerHeight" : "outerWidth"](!0), d.container[h ? "height" : "width"](a)), e = d.carouselOffset || 0, !1 !== d.allowWrap)
                if (d.carouselSlideDimension) e -= (d.slideCount + d.currSlide) * d.carouselSlideDimension;
                else
                    for (a = d._carouselWrap.children(), c = 0; d.slideCount + d.currSlide > c; c++) e -= b(a[c])[h ? "outerHeight" : "outerWidth"](!0);
            d._carouselWrap.css(h ? "top" : "left", e)
        },
        fluidSlides: function(d) {
            function a() {
                clearTimeout(c);
                c = setTimeout(e, 20)
            }

            function e() {
                d._carouselWrap.stop(!1, !0);
                var c = d.container.width() / d.carouselVisible,
                    c = Math.ceil(c - g);
                d._carouselWrap.children().width(c);
                d._sentinel && d._sentinel.width(c);
                l(d)
            }
            var c, h = d.slides.eq(0),
                g = h.outerWidth() - h.width(),
                l = this.prepareDimensions;
            b(window).on("resize",
                a);
            d._carouselResizeThrottle = a;
            e()
        },
        transition: function(d, a, e, c, h) {
            var g;
            a = {};
            e = d.nextSlide - d.currSlide;
            var l = d.carouselVertical,
                f = d.speed;
            if (!1 === d.allowWrap) {
                c = 0 < e;
                g = d._currSlide;
                var k = d.slideCount - d.carouselVisible;
                0 < e && d.nextSlide > k && g == k ? e = 0 : 0 < e && d.nextSlide > k ? e = d.nextSlide - g - (d.nextSlide - k) : 0 > e && d.currSlide > k && d.nextSlide > k ? e = 0 : 0 > e && d.currSlide > k ? e += d.currSlide - k : g = d.currSlide;
                g = this.getScroll(d, l, g, e);
                d.API.opts()._currSlide = d.nextSlide > k ? k : d.nextSlide
            } else c && 0 === d.nextSlide ? (g = this.getDim(d,
                d.currSlide, l), h = this.genCallback(d, c, l, h)) : c || d.nextSlide != d.slideCount - 1 ? g = this.getScroll(d, l, d.currSlide, e) : (g = this.getDim(d, d.currSlide, l), h = this.genCallback(d, c, l, h));
            a[l ? "top" : "left"] = c ? "-=" + g : "+=" + g;
            d.throttleSpeed && (f = g / b(d.slides[0])[l ? "height" : "width"]() * d.speed);
            d._carouselWrap.animate(a, f, d.easing, h)
        },
        getDim: function(d, a, e) {
            return b(d.slides[a])[e ? "outerHeight" : "outerWidth"](!0)
        },
        getScroll: function(b, a, e, c) {
            var h, g = 0;
            if (0 < c)
                for (h = e; e + c > h; h++) g += this.getDim(b, h, a);
            else
                for (h = e; h > e + c; h--) g +=
                    this.getDim(b, h, a);
            return g
        },
        genCallback: function(d, a, e, c) {
            return function() {
                var a = 0 - b(d.slides[d.nextSlide]).position()[e ? "top" : "left"] + (d.carouselOffset || 0);
                d._carouselWrap.css(d.carouselVertical ? "top" : "left", a);
                c()
            }
        },
        stopTransition: function() {
            var b = this.opts();
            b.slides.stop(!1, !0);
            b._carouselWrap.stop(!1, !0)
        },
        onDestroy: function() {
            var d = this.opts();
            d._carouselResizeThrottle && b(window).off("resize", d._carouselResizeThrottle);
            d.slides.prependTo(d.container);
            d._carouselWrap.remove()
        }
    }
})(jQuery);
(function(b) {
    b.fn.cycle.transitions.scrollVert = {
        before: function(b, a, e, c) {
            b.API.stackSlides(b, a, e, c);
            a = b.container.css("overflow", "hidden").height();
            b.cssBefore = {
                top: c ? -a : a,
                left: 0,
                opacity: 1,
                display: "block",
                visibility: "visible"
            };
            b.animIn = {
                top: 0
            };
            b.animOut = {
                top: c ? a : -a
            }
        }
    }
})(jQuery);
(function(b) {
    "function" === typeof define && define.amd ? define(["jquery"], b) : b(window.jQuery || window.Zepto)
})(function(b) {
    var d = function(c, a, e) {
            var d = this,
                f, k;
            c = b(c);
            a = "function" === typeof a ? a(c.val(), void 0, c, e) : a;
            var m = {
                getCaret: function() {
                    try {
                        var a, b = 0,
                            e = c.get(0),
                            d = document.selection,
                            h = e.selectionStart;
                        if (d && !~navigator.appVersion.indexOf("MSIE 10")) a = d.createRange(), a.moveStart("character", c.is("input") ? -c.val().length : -c.text().length), b = a.text.length;
                        else if (h || "0" === h) b = h;
                        return b
                    } catch (g) {}
                },
                setCaret: function(a) {
                    try {
                        if (c.is(":focus")) {
                            var b,
                                e = c.get(0);
                            e.setSelectionRange ? e.setSelectionRange(a, a) : e.createTextRange && (b = e.createTextRange(), b.collapse(!0), b.moveEnd("character", a), b.moveStart("character", a), b.select())
                        }
                    } catch (d) {}
                },
                events: function() {
                    c.on("keydown.mask", function() {
                        f = m.val()
                    }).on("keyup.mask", m.behaviour).on("paste.mask drop.mask", function() {
                        setTimeout(function() {
                            c.keydown().keyup()
                        }, 100)
                    }).on("change.mask", function() {
                        c.data("changed", !0)
                    }).on("blur.mask", function() {
                        f === c.val() || c.data("changed") || c.trigger("change");
                        c.data("changed",
                            !1)
                    }).on("focusout.mask", function() {
                        e.clearIfNotMatch && !k.test(m.val()) && m.val("")
                    })
                },
                getRegexMask: function() {
                    for (var c = [], b, e, g, f, k = 0; k < a.length; k++)(b = d.translation[a[k]]) ? (e = b.pattern.toString().replace(/.{1}$|^.{1}/g, ""), g = b.optional, (b = b.recursive) ? (c.push(a[k]), f = {
                        digit: a[k],
                        pattern: e
                    }) : c.push(g || b ? e + "?" : e)) : c.push(a[k].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                    c = c.join("");
                    f && (c = c.replace(new RegExp("(" + f.digit + "(.*" + f.digit + ")?)"), "($1)?").replace(new RegExp(f.digit, "g"), f.pattern));
                    return new RegExp(c)
                },
                destroyEvents: function() {
                    c.off("keydown keyup paste drop change blur focusout DOMNodeInserted ".split(" ").join(".mask ")).removeData("changeCalled")
                },
                val: function(a) {
                    var b = c.is("input");
                    return 0 < arguments.length ? b ? c.val(a) : c.text(a) : b ? c.val() : c.text()
                },
                getMCharsBeforeCount: function(c, b) {
                    for (var e = 0, g = 0, f = a.length; g < f && g < c; g++) d.translation[a.charAt(g)] || (c = b ? c + 1 : c, e++);
                    return e
                },
                caretPos: function(c, b, e, g) {
                    return d.translation[a.charAt(Math.min(c - 1, a.length - 1))] ? Math.min(c + e - b - g, e) : m.caretPos(c + 1,
                        b, e, g)
                },
                behaviour: function(c) {
                    c = c || window.event;
                    var a = c.keyCode || c.which;
                    if (-1 === b.inArray(a, d.byPassKeys)) {
                        var e = m.getCaret(),
                            h = m.val(),
                            g = h.length,
                            f = e < g,
                            k = m.getMasked(),
                            p = k.length,
                            t = m.getMCharsBeforeCount(p - 1) - m.getMCharsBeforeCount(g - 1);
                        k !== h && m.val(k);
                        !f || 65 === a && c.ctrlKey || (8 !== a && 46 !== a && (e = m.caretPos(e, g, p, t)), m.setCaret(e));
                        return m.callbacks(c)
                    }
                },
                getMasked: function(c) {
                    var b = [],
                        f = m.val(),
                        k = 0,
                        w = a.length,
                        q = 0,
                        z = f.length,
                        p = 1,
                        t = "push",
                        x = -1,
                        u, A;
                    for (e.reverse ? (t = "unshift", p = -1, u = 0, k = w - 1, q = z - 1, A = function() {
                            return -1 <
                                k && -1 < q
                        }) : (u = w - 1, A = function() {
                            return k < w && q < z
                        }); A();) {
                        var B = a.charAt(k),
                            C = f.charAt(q),
                            y = d.translation[B];
                        if (y) C.match(y.pattern) ? (b[t](C), y.recursive && (-1 === x ? x = k : k === u && (k = x - p), u === x && (k -= p)), k += p) : y.optional && (k += p, q -= p), q += p;
                        else {
                            if (!c) b[t](B);
                            C === B && (q += p);
                            k += p
                        }
                    }
                    c = a.charAt(u);
                    w !== z + 1 || d.translation[c] || b.push(c);
                    return b.join("")
                },
                callbacks: function(b) {
                    var d = m.val(),
                        l = d !== f;
                    if (!0 === l && "function" === typeof e.onChange) e.onChange(d, b, c, e);
                    if (!0 === l && "function" === typeof e.onKeyPress) e.onKeyPress(d,
                        b, c, e);
                    if ("function" === typeof e.onComplete && d.length === a.length) e.onComplete(d, b, c, e)
                }
            };
            d.mask = a;
            d.options = e;
            d.remove = function() {
                var a;
                m.destroyEvents();
                m.val(d.getCleanVal()).removeAttr("maxlength");
                a = m.getCaret();
                m.setCaret(a - m.getMCharsBeforeCount(a));
                return c
            };
            d.getCleanVal = function() {
                return m.getMasked(!0)
            };
            d.init = function() {
                e = e || {};
                d.byPassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
                d.translation = {
                    0: {
                        pattern: /\d/
                    },
                    9: {
                        pattern: /\d/,
                        optional: !0
                    },
                    "#": {
                        pattern: /\d/,
                        recursive: !0
                    },
                    A: {
                        pattern: /[a-zA-Z0-9]/
                    },
                    S: {
                        pattern: /[a-zA-Z]/
                    }
                };
                d.translation = b.extend({}, d.translation, e.translation);
                d = b.extend(!0, {}, d, e);
                k = m.getRegexMask();
                !1 !== e.maxlength && c.attr("maxlength", a.length);
                e.placeholder && c.attr("placeholder", e.placeholder);
                c.attr("autocomplete", "off");
                m.destroyEvents();
                m.events();
                var f = m.getCaret();
                m.val(m.getMasked());
                m.setCaret(f + m.getMCharsBeforeCount(f, !0))
            }()
        },
        a = {},
        e = function() {
            var c = b(this),
                a = {};
            c.attr("data-mask-reverse") && (a.reverse = !0);
            "false" === c.attr("data-mask-maxlength") && (a.maxlength = !1);
            c.attr("data-mask-clearifnotmatch") && (a.clearIfNotMatch = !0);
            c.mask(c.attr("data-mask"), a)
        };
    b.fn.mask = function(c, e) {
        var g = this.selector,
            l = function() {
                var a = b(this).data("mask"),
                    g = JSON.stringify;
                if ("object" !== typeof a || g(a.options) !== g(e) || a.mask !== c) return b(this).data("mask", new d(this, c, e))
            };
        this.each(l);
        g && !a[g] && (a[g] = !0, setTimeout(function() {
            b(document).on("DOMNodeInserted.mask", g, l)
        }, 500))
    };
    b.fn.unmask = function() {
        try {
            return this.each(function() {
                b(this).data("mask").remove().removeData("mask")
            })
        } catch (c) {}
    };
    b.fn.cleanVal = function() {
        return this.data("mask").getCleanVal()
    };
    b("*[data-mask]").each(e);
    b(document).on("DOMNodeInserted.mask", "*[data-mask]", e)
});
"function" !== typeof Object.create && (Object.create = function(b) {
    function d() {}
    d.prototype = b;
    return new d
});
(function(b, d, a) {
    var e = {
        init: function(c, a) {
            this.$elem = b(a);
            this.options = b.extend({}, b.fn.owlCarousel.options, this.$elem.data(), c);
            this.userOptions = c;
            this.loadContent()
        },
        loadContent: function() {
            function c(c) {
                var b, e = "";
                if ("function" === typeof a.options.jsonSuccess) a.options.jsonSuccess.apply(this, [c]);
                else {
                    for (b in c.owl) c.owl.hasOwnProperty(b) && (e += c.owl[b].item);
                    a.$elem.html(e)
                }
                a.logIn()
            }
            var a = this,
                e;
            "function" === typeof a.options.beforeInit && a.options.beforeInit.apply(this, [a.$elem]);
            "string" === typeof a.options.jsonPath ?
                (e = a.options.jsonPath, b.getJSON(e, c)) : a.logIn()
        },
        logIn: function() {
            this.$elem.data("owl-originalStyles", this.$elem.attr("style"));
            this.$elem.data("owl-originalClasses", this.$elem.attr("class"));
            this.$elem.css({
                opacity: 0
            });
            this.orignalItems = this.options.items;
            this.checkBrowser();
            this.wrapperWidth = 0;
            this.checkVisible = null;
            this.setVars()
        },
        setVars: function() {
            if (0 === this.$elem.children().length) return !1;
            this.baseClass();
            this.eventTypes();
            this.$userItems = this.$elem.children();
            this.itemsAmount = this.$userItems.length;
            this.wrapItems();
            this.$owlItems = this.$elem.find(".owl-item");
            this.$owlWrapper = this.$elem.find(".owl-wrapper");
            this.playDirection = "next";
            this.prevItem = 0;
            this.prevArr = [0];
            this.currentItem = 0;
            this.customEvents();
            this.onStartup()
        },
        onStartup: function() {
            this.updateItems();
            this.calculateAll();
            this.buildControls();
            this.updateControls();
            this.response();
            this.moveEvents();
            this.stopOnHover();
            this.owlStatus();
            !1 !== this.options.transitionStyle && this.transitionTypes(this.options.transitionStyle);
            !0 === this.options.autoPlay &&
                (this.options.autoPlay = 5E3);
            this.play();
            this.$elem.find(".owl-wrapper").css("display", "block");
            this.$elem.is(":visible") ? this.$elem.css("opacity", 1) : this.watchVisibility();
            this.onstartup = !1;
            this.eachMoveUpdate();
            "function" === typeof this.options.afterInit && this.options.afterInit.apply(this, [this.$elem])
        },
        eachMoveUpdate: function() {
            !0 === this.options.lazyLoad && this.lazyLoad();
            !0 === this.options.autoHeight && this.autoHeight();
            this.onVisibleItems();
            "function" === typeof this.options.afterAction && this.options.afterAction.apply(this,
                [this.$elem])
        },
        updateVars: function() {
            "function" === typeof this.options.beforeUpdate && this.options.beforeUpdate.apply(this, [this.$elem]);
            this.watchVisibility();
            this.updateItems();
            this.calculateAll();
            this.updatePosition();
            this.updateControls();
            this.eachMoveUpdate();
            "function" === typeof this.options.afterUpdate && this.options.afterUpdate.apply(this, [this.$elem])
        },
        reload: function() {
            var c = this;
            d.setTimeout(function() {
                c.updateVars()
            }, 0)
        },
        watchVisibility: function() {
            var c = this;
            if (!1 === c.$elem.is(":visible")) c.$elem.css({
                    opacity: 0
                }),
                d.clearInterval(c.autoPlayInterval), d.clearInterval(c.checkVisible);
            else return !1;
            c.checkVisible = d.setInterval(function() {
                c.$elem.is(":visible") && (c.reload(), c.$elem.animate({
                    opacity: 1
                }, 200), d.clearInterval(c.checkVisible))
            }, 500)
        },
        wrapItems: function() {
            this.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');
            this.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');
            this.wrapperOuter = this.$elem.find(".owl-wrapper-outer");
            this.$elem.css("display", "block")
        },
        baseClass: function() {
            var c = this.$elem.hasClass(this.options.baseClass),
                a = this.$elem.hasClass(this.options.theme);
            c || this.$elem.addClass(this.options.baseClass);
            a || this.$elem.addClass(this.options.theme)
        },
        updateItems: function() {
            var c, a;
            if (!1 === this.options.responsive) return !1;
            if (!0 === this.options.singleItem) return this.options.items = this.orignalItems = 1, this.options.itemsCustom = !1, this.options.itemsDesktop = !1, this.options.itemsDesktopSmall = !1, this.options.itemsTablet = !1, this.options.itemsTabletSmall = !1, this.options.itemsMobile = !1;
            c = b(this.options.responsiveBaseWidth).width();
            c > (this.options.itemsDesktop[0] || this.orignalItems) && (this.options.items = this.orignalItems);
            if (!1 !== this.options.itemsCustom)
                for (this.options.itemsCustom.sort(function(c, a) {
                        return c[0] - a[0]
                    }), a = 0; a < this.options.itemsCustom.length; a += 1) this.options.itemsCustom[a][0] <= c && (this.options.items = this.options.itemsCustom[a][1]);
            else c <= this.options.itemsDesktop[0] && !1 !== this.options.itemsDesktop && (this.options.items = this.options.itemsDesktop[1]),
                c <= this.options.itemsDesktopSmall[0] && !1 !== this.options.itemsDesktopSmall && (this.options.items = this.options.itemsDesktopSmall[1]), c <= this.options.itemsTablet[0] && !1 !== this.options.itemsTablet && (this.options.items = this.options.itemsTablet[1]), c <= this.options.itemsTabletSmall[0] && !1 !== this.options.itemsTabletSmall && (this.options.items = this.options.itemsTabletSmall[1]), c <= this.options.itemsMobile[0] && !1 !== this.options.itemsMobile && (this.options.items = this.options.itemsMobile[1]);
            this.options.items > this.itemsAmount &&
                !0 === this.options.itemsScaleUp && (this.options.items = this.itemsAmount)
        },
        response: function() {
            var c = this,
                a, e;
            if (!0 !== c.options.responsive) return !1;
            e = b(d).width();
            c.resizer = function() {
                b(d).width() !== e && (!1 !== c.options.autoPlay && d.clearInterval(c.autoPlayInterval), d.clearTimeout(a), a = d.setTimeout(function() {
                    e = b(d).width();
                    c.updateVars()
                }, c.options.responsiveRefreshRate))
            };
            b(d).on("resize", c.resizer)
        },
        updatePosition: function() {
            this.jumpTo(this.currentItem);
            !1 !== this.options.autoPlay && this.checkAp()
        },
        appendItemsSizes: function() {
            var c =
                this,
                a = 0,
                e = c.itemsAmount - c.options.items;
            c.$owlItems.each(function(d) {
                var f = b(this);
                f.css({
                    width: c.itemWidth
                }).data("owl-item", Number(d));
                if (0 === d % c.options.items || d === e) d > e || (a += 1);
                f.data("owl-roundPages", a)
            })
        },
        appendWrapperSizes: function() {
            this.$owlWrapper.css({
                width: this.$owlItems.length * this.itemWidth * 2,
                left: 0
            });
            this.appendItemsSizes()
        },
        calculateAll: function() {
            this.calculateWidth();
            this.appendWrapperSizes();
            this.loops();
            this.max()
        },
        calculateWidth: function() {
            this.itemWidth = Math.round(this.$elem.width() /
                this.options.items)
        },
        max: function() {
            var c = -1 * (this.itemsAmount * this.itemWidth - this.options.items * this.itemWidth);
            this.options.items > this.itemsAmount ? this.maximumPixels = c = this.maximumItem = 0 : (this.maximumItem = this.itemsAmount - this.options.items, this.maximumPixels = c);
            return c
        },
        min: function() {
            return 0
        },
        loops: function() {
            var c = 0,
                a = 0,
                e, d;
            this.positionsInArray = [0];
            this.pagesInArray = [];
            for (e = 0; e < this.itemsAmount; e += 1) a += this.itemWidth, this.positionsInArray.push(-a), !0 === this.options.scrollPerPage && (d = b(this.$owlItems[e]),
                d = d.data("owl-roundPages"), d !== c && (this.pagesInArray[c] = this.positionsInArray[e], c = d))
        },
        buildControls: function() {
            if (!0 === this.options.navigation || !0 === this.options.pagination) this.owlControls = b('<div class="owl-controls"/>').toggleClass("clickable", !this.browser.isTouch).appendTo(this.$elem);
            !0 === this.options.pagination && this.buildPagination();
            !0 === this.options.navigation && this.buildButtons()
        },
        buildButtons: function() {
            var c = this,
                a = b('<div class="owl-buttons"/>');
            c.owlControls.append(a);
            c.buttonPrev =
                b("<div/>", {
                    "class": "owl-prev",
                    html: c.options.navigationText[0] || ""
                });
            c.buttonNext = b("<div/>", {
                "class": "owl-next",
                html: c.options.navigationText[1] || ""
            });
            a.append(c.buttonPrev).append(c.buttonNext);
            a.on("touchstart.owlControls mousedown.owlControls", 'div[class^="owl"]', function(c) {
                c.preventDefault()
            });
            a.on("touchend.owlControls mouseup.owlControls", 'div[class^="owl"]', function(a) {
                a.preventDefault();
                b(this).hasClass("owl-next") ? c.next() : c.prev()
            })
        },
        buildPagination: function() {
            var c = this;
            c.paginationWrapper =
                b('<div class="owl-pagination"/>');
            c.owlControls.append(c.paginationWrapper);
            c.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function(a) {
                a.preventDefault();
                Number(b(this).data("owl-page")) !== c.currentItem && c.goTo(Number(b(this).data("owl-page")), !0)
            })
        },
        updatePagination: function() {
            var c, a, e, d, f, k;
            if (!1 === this.options.pagination) return !1;
            this.paginationWrapper.html("");
            c = 0;
            a = this.itemsAmount - this.itemsAmount % this.options.items;
            for (d = 0; d < this.itemsAmount; d += 1) 0 === d % this.options.items &&
                (c += 1, a === d && (e = this.itemsAmount - this.options.items), f = b("<div/>", {
                    "class": "owl-page"
                }), k = b("<span></span>", {
                    text: !0 === this.options.paginationNumbers ? c : "",
                    "class": !0 === this.options.paginationNumbers ? "owl-numbers" : ""
                }), f.append(k), f.data("owl-page", a === d ? e : d), f.data("owl-roundPages", c), this.paginationWrapper.append(f));
            this.checkPagination()
        },
        checkPagination: function() {
            var c = this;
            if (!1 === c.options.pagination) return !1;
            c.paginationWrapper.find(".owl-page").each(function() {
                b(this).data("owl-roundPages") ===
                    b(c.$owlItems[c.currentItem]).data("owl-roundPages") && (c.paginationWrapper.find(".owl-page").removeClass("active"), b(this).addClass("active"))
            })
        },
        checkNavigation: function() {
            if (!1 === this.options.navigation) return !1;
            !1 === this.options.rewindNav && (0 === this.currentItem && 0 === this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.addClass("disabled")) : 0 === this.currentItem && 0 !== this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.removeClass("disabled")) : this.currentItem ===
                this.maximumItem ? (this.buttonPrev.removeClass("disabled"), this.buttonNext.addClass("disabled")) : 0 !== this.currentItem && this.currentItem !== this.maximumItem && (this.buttonPrev.removeClass("disabled"), this.buttonNext.removeClass("disabled")))
        },
        updateControls: function() {
            this.updatePagination();
            this.checkNavigation();
            this.owlControls && (this.options.items >= this.itemsAmount ? this.owlControls.hide() : this.owlControls.show())
        },
        destroyControls: function() {
            this.owlControls && this.owlControls.remove()
        },
        next: function(c) {
            if (this.isTransition) return !1;
            this.currentItem += !0 === this.options.scrollPerPage ? this.options.items : 1;
            if (this.currentItem > this.maximumItem + (!0 === this.options.scrollPerPage ? this.options.items - 1 : 0))
                if (!0 === this.options.rewindNav) this.currentItem = 0, c = "rewind";
                else return this.currentItem = this.maximumItem, !1;
            this.goTo(this.currentItem, c)
        },
        prev: function(c) {
            if (this.isTransition) return !1;
            this.currentItem = !0 === this.options.scrollPerPage && 0 < this.currentItem && this.currentItem < this.options.items ? 0 : this.currentItem - (!0 === this.options.scrollPerPage ?
                this.options.items : 1);
            if (0 > this.currentItem)
                if (!0 === this.options.rewindNav) this.currentItem = this.maximumItem, c = "rewind";
                else return this.currentItem = 0, !1;
            this.goTo(this.currentItem, c)
        },
        goTo: function(c, a, e) {
            var b = this;
            if (b.isTransition) return !1;
            "function" === typeof b.options.beforeMove && b.options.beforeMove.apply(this, [b.$elem]);
            c >= b.maximumItem ? c = b.maximumItem : 0 >= c && (c = 0);
            b.currentItem = b.owl.currentItem = c;
            if (!1 !== b.options.transitionStyle && "drag" !== e && 1 === b.options.items && !0 === b.browser.support3d) return b.swapSpeed(0),
                !0 === b.browser.support3d ? b.transition3d(b.positionsInArray[c]) : b.css2slide(b.positionsInArray[c], 1), b.afterGo(), b.singleItemTransition(), !1;
            c = b.positionsInArray[c];
            !0 === b.browser.support3d ? (b.isCss3Finish = !1, !0 === a ? (b.swapSpeed("paginationSpeed"), d.setTimeout(function() {
                b.isCss3Finish = !0
            }, b.options.paginationSpeed)) : "rewind" === a ? (b.swapSpeed(b.options.rewindSpeed), d.setTimeout(function() {
                b.isCss3Finish = !0
            }, b.options.rewindSpeed)) : (b.swapSpeed("slideSpeed"), d.setTimeout(function() {
                    b.isCss3Finish = !0
                },
                b.options.slideSpeed)), b.transition3d(c)) : !0 === a ? b.css2slide(c, b.options.paginationSpeed) : "rewind" === a ? b.css2slide(c, b.options.rewindSpeed) : b.css2slide(c, b.options.slideSpeed);
            b.afterGo()
        },
        jumpTo: function(c) {
            "function" === typeof this.options.beforeMove && this.options.beforeMove.apply(this, [this.$elem]);
            c >= this.maximumItem || -1 === c ? c = this.maximumItem : 0 >= c && (c = 0);
            this.swapSpeed(0);
            !0 === this.browser.support3d ? this.transition3d(this.positionsInArray[c]) : this.css2slide(this.positionsInArray[c], 1);
            this.currentItem =
                this.owl.currentItem = c;
            this.afterGo()
        },
        afterGo: function() {
            this.prevArr.push(this.currentItem);
            this.prevItem = this.owl.prevItem = this.prevArr[this.prevArr.length - 2];
            this.prevArr.shift(0);
            this.prevItem !== this.currentItem && (this.checkPagination(), this.checkNavigation(), this.eachMoveUpdate(), !1 !== this.options.autoPlay && this.checkAp());
            "function" === typeof this.options.afterMove && this.prevItem !== this.currentItem && this.options.afterMove.apply(this, [this.$elem])
        },
        stop: function() {
            this.apStatus = "stop";
            d.clearInterval(this.autoPlayInterval)
        },
        checkAp: function() {
            "stop" !== this.apStatus && this.play()
        },
        play: function() {
            var c = this;
            c.apStatus = "play";
            if (!1 === c.options.autoPlay) return !1;
            d.clearInterval(c.autoPlayInterval);
            c.autoPlayInterval = d.setInterval(function() {
                c.next(!0)
            }, c.options.autoPlay)
        },
        swapSpeed: function(c) {
            "slideSpeed" === c ? this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed)) : "paginationSpeed" === c ? this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed)) : "string" !== typeof c && this.$owlWrapper.css(this.addCssSpeed(c))
        },
        addCssSpeed: function(c) {
            return {
                "-webkit-transition": "all " + c + "ms ease",
                "-moz-transition": "all " + c + "ms ease",
                "-o-transition": "all " + c + "ms ease",
                transition: "all " + c + "ms ease"
            }
        },
        removeTransition: function() {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                transition: ""
            }
        },
        doTranslate: function(c) {
            return {
                "-webkit-transform": "translate3d(" + c + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + c + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + c + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" +
                    c + "px, 0px, 0px)",
                transform: "translate3d(" + c + "px, 0px,0px)"
            }
        },
        transition3d: function(c) {
            this.$owlWrapper.css(this.doTranslate(c))
        },
        css2move: function(c) {
            this.$owlWrapper.css({
                left: c
            })
        },
        css2slide: function(c, a) {
            var b = this;
            b.isCssFinish = !1;
            b.$owlWrapper.stop(!0, !0).animate({
                left: c
            }, {
                duration: a || b.options.slideSpeed,
                complete: function() {
                    b.isCssFinish = !0
                }
            })
        },
        checkBrowser: function() {
            var c = a.createElement("div");
            c.style.cssText = "  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)";
            c = c.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);
            this.browser = {
                support3d: null !== c && 1 <= c.length && 2 >= c.length,
                isTouch: "ontouchstart" in d || d.navigator.msMaxTouchPoints
            }
        },
        moveEvents: function() {
            if (!1 !== this.options.mouseDrag || !1 !== this.options.touchDrag) this.gestures(), this.disabledEvents()
        },
        eventTypes: function() {
            var c = ["s", "e", "x"];
            this.ev_types = {};
            !0 === this.options.mouseDrag && !0 === this.options.touchDrag ? c = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"] :
                !1 === this.options.mouseDrag && !0 === this.options.touchDrag ? c = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"] : !0 === this.options.mouseDrag && !1 === this.options.touchDrag && (c = ["mousedown.owl", "mousemove.owl", "mouseup.owl"]);
            this.ev_types.start = c[0];
            this.ev_types.move = c[1];
            this.ev_types.end = c[2]
        },
        disabledEvents: function() {
            this.$elem.on("dragstart.owl", function(c) {
                c.preventDefault()
            });
            this.$elem.on("mousedown.disableTextSelect", function(c) {
                return b(c.target).is("input, textarea, select, option")
            })
        },
        gestures: function() {
            function c(c) {
                if (void 0 !== c.touches) return {
                    x: c.touches[0].pageX,
                    y: c.touches[0].pageY
                };
                if (void 0 === c.touches) {
                    if (void 0 !== c.pageX) return {
                        x: c.pageX,
                        y: c.pageY
                    };
                    if (void 0 === c.pageX) return {
                        x: c.clientX,
                        y: c.clientY
                    }
                }
            }

            function e(c) {
                "on" === c ? (b(a).on(f.ev_types.move, g), b(a).on(f.ev_types.end, l)) : "off" === c && (b(a).off(f.ev_types.move), b(a).off(f.ev_types.end))
            }

            function g(e) {
                e = e.originalEvent || e || d.event;
                f.newPosX = c(e).x - k.offsetX;
                f.newPosY = c(e).y - k.offsetY;
                f.newRelativeX = f.newPosX - k.relativePos;
                "function" === typeof f.options.startDragging && !0 !== k.dragging && 0 !== f.newRelativeX && (k.dragging = !0, f.options.startDragging.apply(f, [f.$elem]));
                (8 < f.newRelativeX || -8 > f.newRelativeX) && !0 === f.browser.isTouch && (void 0 !== e.preventDefault ? e.preventDefault() : e.returnValue = !1, k.sliding = !0);
                (10 < f.newPosY || -10 > f.newPosY) && !1 === k.sliding && b(a).off("touchmove.owl");
                f.newPosX = Math.max(Math.min(f.newPosX, f.newRelativeX / 5), f.maximumPixels + f.newRelativeX / 5);
                !0 === f.browser.support3d ? f.transition3d(f.newPosX) : f.css2move(f.newPosX)
            }

            function l(c) {
                c = c.originalEvent || c || d.event;
                var a;
                c.target = c.target || c.srcElement;
                k.dragging = !1;
                !0 !== f.browser.isTouch && f.$owlWrapper.removeClass("grabbing");
                f.dragDirection = 0 > f.newRelativeX ? f.owl.dragDirection = "left" : f.owl.dragDirection = "right";
                0 !== f.newRelativeX && (a = f.getNewPosition(), f.goTo(a, !1, "drag"), k.targetElement === c.target && !0 !== f.browser.isTouch && (b(c.target).on("click.disable", function(c) {
                        c.stopImmediatePropagation();
                        c.stopPropagation();
                        c.preventDefault();
                        b(c.target).off("click.disable")
                    }),
                    c = b._data(c.target, "events").click, a = c.pop(), c.splice(0, 0, a)));
                e("off")
            }
            var f = this,
                k = {
                    offsetX: 0,
                    offsetY: 0,
                    baseElWidth: 0,
                    relativePos: 0,
                    position: null,
                    minSwipe: null,
                    maxSwipe: null,
                    sliding: null,
                    dargging: null,
                    targetElement: null
                };
            f.isCssFinish = !0;
            f.$elem.on(f.ev_types.start, ".owl-wrapper", function(a) {
                a = a.originalEvent || a || d.event;
                var g;
                if (3 === a.which) return !1;
                if (!(f.itemsAmount <= f.options.items)) {
                    if (!1 === f.isCssFinish && !f.options.dragBeforeAnimFinish || !1 === f.isCss3Finish && !f.options.dragBeforeAnimFinish) return !1;
                    !1 !== f.options.autoPlay && d.clearInterval(f.autoPlayInterval);
                    !0 === f.browser.isTouch || f.$owlWrapper.hasClass("grabbing") || f.$owlWrapper.addClass("grabbing");
                    f.newPosX = 0;
                    f.newRelativeX = 0;
                    b(this).css(f.removeTransition());
                    g = b(this).position();
                    k.relativePos = g.left;
                    k.offsetX = c(a).x - g.left;
                    k.offsetY = c(a).y - g.top;
                    e("on");
                    k.sliding = !1;
                    k.targetElement = a.target || a.srcElement
                }
            })
        },
        getNewPosition: function() {
            var c = this.closestItem();
            c > this.maximumItem ? c = this.currentItem = this.maximumItem : 0 <= this.newPosX && (this.currentItem =
                c = 0);
            return c
        },
        closestItem: function() {
            var c = this,
                a = !0 === c.options.scrollPerPage ? c.pagesInArray : c.positionsInArray,
                e = c.newPosX,
                d = null;
            b.each(a, function(f, k) {
                e - c.itemWidth / 20 > a[f + 1] && e - c.itemWidth / 20 < k && "left" === c.moveDirection() ? (d = k, c.currentItem = !0 === c.options.scrollPerPage ? b.inArray(d, c.positionsInArray) : f) : e + c.itemWidth / 20 < k && e + c.itemWidth / 20 > (a[f + 1] || a[f] - c.itemWidth) && "right" === c.moveDirection() && (!0 === c.options.scrollPerPage ? (d = a[f + 1] || a[a.length - 1], c.currentItem = b.inArray(d, c.positionsInArray)) :
                    (d = a[f + 1], c.currentItem = f + 1))
            });
            return c.currentItem
        },
        moveDirection: function() {
            var c;
            0 > this.newRelativeX ? (c = "right", this.playDirection = "next") : (c = "left", this.playDirection = "prev");
            return c
        },
        customEvents: function() {
            var c = this;
            c.$elem.on("owl.next", function() {
                c.next()
            });
            c.$elem.on("owl.prev", function() {
                c.prev()
            });
            c.$elem.on("owl.play", function(a, b) {
                c.options.autoPlay = b;
                c.play();
                c.hoverStatus = "play"
            });
            c.$elem.on("owl.stop", function() {
                c.stop();
                c.hoverStatus = "stop"
            });
            c.$elem.on("owl.goTo", function(a, b) {
                c.goTo(b)
            });
            c.$elem.on("owl.jumpTo", function(a, b) {
                c.jumpTo(b)
            })
        },
        stopOnHover: function() {
            var c = this;
            !0 === c.options.stopOnHover && !0 !== c.browser.isTouch && !1 !== c.options.autoPlay && (c.$elem.on("mouseover", function() {
                c.stop()
            }), c.$elem.on("mouseout", function() {
                "stop" !== c.hoverStatus && c.play()
            }))
        },
        lazyLoad: function() {
            var c, a, e, d, f;
            if (!1 === this.options.lazyLoad) return !1;
            for (c = 0; c < this.itemsAmount; c += 1) a = b(this.$owlItems[c]), "loaded" !== a.data("owl-loaded") && (e = a.data("owl-item"), d = a.find(".lazyOwl"), "string" !== typeof d.data("src") ?
                a.data("owl-loaded", "loaded") : (void 0 === a.data("owl-loaded") && (d.hide(), a.addClass("loading").data("owl-loaded", "checked")), (f = !0 === this.options.lazyFollow ? e >= this.currentItem : !0) && e < this.currentItem + this.options.items && d.length && this.lazyPreload(a, d)))
        },
        lazyPreload: function(c, a) {
            function b() {
                c.data("owl-loaded", "loaded").removeClass("loading");
                a.removeAttr("data-src");
                "fade" === f.options.lazyEffect ? a.fadeIn(400) : a.show();
                "function" === typeof f.options.afterLazyLoad && f.options.afterLazyLoad.apply(this,
                    [f.$elem])
            }

            function e() {
                k += 1;
                f.completeImg(a.get(0)) || !0 === m ? b() : 100 >= k ? d.setTimeout(e, 100) : b()
            }
            var f = this,
                k = 0,
                m;
            "DIV" === a.prop("tagName") ? (a.css("background-image", "url(" + a.data("src") + ")"), m = !0) : a[0].src = a.data("src");
            e()
        },
        autoHeight: function() {
            function a() {
                var c = b(g.$owlItems[g.currentItem]).height();
                g.wrapperOuter.css("height", c + "px");
                g.wrapperOuter.hasClass("autoHeight") || d.setTimeout(function() {
                    g.wrapperOuter.addClass("autoHeight")
                }, 0)
            }

            function e() {
                f += 1;
                g.completeImg(l.get(0)) ? a() : 100 >= f ? d.setTimeout(e,
                    100) : g.wrapperOuter.css("height", "")
            }
            var g = this,
                l = b(g.$owlItems[g.currentItem]).find("img"),
                f;
            void 0 !== l.get(0) ? (f = 0, e()) : a()
        },
        completeImg: function(a) {
            return !a.complete || "undefined" !== typeof a.naturalWidth && 0 === a.naturalWidth ? !1 : !0
        },
        onVisibleItems: function() {
            var a;
            !0 === this.options.addClassActive && this.$owlItems.removeClass("active");
            this.visibleItems = [];
            for (a = this.currentItem; a < this.currentItem + this.options.items; a += 1) this.visibleItems.push(a), !0 === this.options.addClassActive && b(this.$owlItems[a]).addClass("active");
            this.owl.visibleItems = this.visibleItems
        },
        transitionTypes: function(a) {
            this.outClass = "owl-" + a + "-out";
            this.inClass = "owl-" + a + "-in"
        },
        singleItemTransition: function() {
            var a = this,
                b = a.outClass,
                e = a.inClass,
                d = a.$owlItems.eq(a.currentItem),
                f = a.$owlItems.eq(a.prevItem),
                k = Math.abs(a.positionsInArray[a.currentItem]) + a.positionsInArray[a.prevItem],
                m = Math.abs(a.positionsInArray[a.currentItem]) + a.itemWidth / 2;
            a.isTransition = !0;
            a.$owlWrapper.addClass("owl-origin").css({
                "-webkit-transform-origin": m + "px",
                "-moz-perspective-origin": m +
                    "px",
                "perspective-origin": m + "px"
            });
            f.css({
                position: "relative",
                left: k + "px"
            }).addClass(b).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function() {
                a.endPrev = !0;
                f.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
                a.clearTransStyle(f, b)
            });
            d.addClass(e).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function() {
                a.endCurrent = !0;
                d.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
                a.clearTransStyle(d, e)
            })
        },
        clearTransStyle: function(a,
            b) {
            a.css({
                position: "",
                left: ""
            }).removeClass(b);
            this.endPrev && this.endCurrent && (this.$owlWrapper.removeClass("owl-origin"), this.isTransition = this.endCurrent = this.endPrev = !1)
        },
        owlStatus: function() {
            this.owl = {
                userOptions: this.userOptions,
                baseElement: this.$elem,
                userItems: this.$userItems,
                owlItems: this.$owlItems,
                currentItem: this.currentItem,
                prevItem: this.prevItem,
                visibleItems: this.visibleItems,
                isTouch: this.browser.isTouch,
                browser: this.browser,
                dragDirection: this.dragDirection
            }
        },
        clearEvents: function() {
            this.$elem.off(".owl owl mousedown.disableTextSelect");
            b(a).off(".owl owl");
            b(d).off("resize", this.resizer)
        },
        unWrap: function() {
            0 !== this.$elem.children().length && (this.$owlWrapper.unwrap(), this.$userItems.unwrap().unwrap(), this.owlControls && this.owlControls.remove());
            this.clearEvents();
            this.$elem.attr("style", this.$elem.data("owl-originalStyles") || "").attr("class", this.$elem.data("owl-originalClasses"))
        },
        destroy: function() {
            this.stop();
            d.clearInterval(this.checkVisible);
            this.unWrap();
            this.$elem.removeData()
        },
        reinit: function(a) {
            a = b.extend({}, this.userOptions,
                a);
            this.unWrap();
            this.init(a, this.$elem)
        },
        addItem: function(a, b) {
            var e;
            if (!a) return !1;
            if (0 === this.$elem.children().length) return this.$elem.append(a), this.setVars(), !1;
            this.unWrap();
            e = void 0 === b || -1 === b ? -1 : b;
            e >= this.$userItems.length || -1 === e ? this.$userItems.eq(-1).after(a) : this.$userItems.eq(e).before(a);
            this.setVars()
        },
        removeItem: function(a) {
            if (0 === this.$elem.children().length) return !1;
            a = void 0 === a || -1 === a ? -1 : a;
            this.unWrap();
            this.$userItems.eq(a).remove();
            this.setVars()
        }
    };
    b.fn.owlCarousel = function(a) {
        return this.each(function() {
            if (!0 ===
                b(this).data("owl-init")) return !1;
            b(this).data("owl-init", !0);
            var d = Object.create(e);
            d.init(a, this);
            b.data(this, "owlCarousel", d)
        })
    };
    b.fn.owlCarousel.options = {
        items: 5,
        itemsCustom: !1,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 2],
        itemsTabletSmall: !1,
        itemsMobile: [479, 1],
        singleItem: !1,
        itemsScaleUp: !1,
        slideSpeed: 200,
        paginationSpeed: 800,
        rewindSpeed: 1E3,
        autoPlay: !1,
        stopOnHover: !1,
        navigation: !1,
        navigationText: ["prev", "next"],
        rewindNav: !0,
        scrollPerPage: !1,
        pagination: !0,
        paginationNumbers: !1,
        responsive: !0,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: d,
        baseClass: "owl-carousel",
        theme: "owl-theme",
        lazyLoad: !1,
        lazyFollow: !0,
        lazyEffect: "fade",
        autoHeight: !1,
        jsonPath: !1,
        jsonSuccess: !1,
        dragBeforeAnimFinish: !0,
        mouseDrag: !0,
        touchDrag: !0,
        addClassActive: !1,
        transitionStyle: !1,
        beforeUpdate: !1,
        afterUpdate: !1,
        beforeInit: !1,
        afterInit: !1,
        beforeMove: !1,
        afterMove: !1,
        afterAction: !1,
        startDragging: !1,
        afterLazyLoad: !1
    }
})(jQuery, window, document);
var host_img_s3 = "https://1099028l.ha.azioncdn.net";
window.console || (window.console = {}, window.console.log = function(b) {}, window.console.dir = function(b) {});
window.opera && (window.console.log = function(b) {
    opera.postError(b)
}, window.console.dir = function(b) {});
console.todo = function(b) {
    return console.warn("TODO:" + b)
};
window._gapiLoad = [];
window.gapiLoad = function() {
    $.each(window._gapiLoad, function() {
        this.apply()
    })
};
var Zord = function() {
    var b = {},
        d = {};
    return {
        ready: function(a) {
            $(document).ready(a)
        },
        block: function(a, b) {
            a = !1 !== a ? !0 : !1;
            var c = null,
                d = $(document.body),
                g = null,
                l = [];
            0 < $("#block").length ? (c = $("#block"), c.remove("#loading"), $(".mensagem-pop-up").each(function(a, c) {
                g = parseInt($(c).css("z-index"))
            }), null !== g && (g++, c.css("z-index", g)), l = c.data("index-control"), l.push(c.css("z-index"))) : (c = $('<div id="block"></div>'), c.css({
                    position: "fixed",
                    top: 0,
                    bottom: 0
                }), c.on("bind", "dblclick", function(a) {
                    a.ctrlKey && Zord.unblock()
                }),
                d.append(c), l = [c.css("z-index")]);
            if (a) {
                var f = $('<div id="loading"></div>');
                null !== g && (g++, f.css("z-index", g));
                d.append(f)
            }
            if (b) c.on("click", Zord.msgHide);
            c.data("index-control", l);
            return c
        },
        msgHide: function(a) {
            !1 !== a && Zord.unblock();
            d.close && d.close.call();
            d.parent && (d.content.hide(), d.parent.append(d.content));
            var b = null;
            $(".mensagem-pop-up").each(function(a, d) {
                b = $(d)
            });
            return null !== b ? (b.remove(), 0 < b.length) : !1
        },
        msg: function(a, b, c, h, g, l, f) {
            g = g || 200;
            l = l || !1;
            var k = this.block(!1, !0),
                m = null;
            $(".mensagem-pop-up").each(function(a,
                c) {
                m = parseInt($(c).css("z-index"))
            });
            var n = $(document.createElement("div")).hide();
            n.data("block", k);
            n.attr("id", "popup" + (new Date).getTime());
            n.css("min-height", g);
            null !== m && (m += 2, n.css("z-index", m));
            l && n.width(l);
            n.addClass("mensagem-pop-up");
            g = $('<span class="close">X</span>');
            d.close = h;
            g.on("click", Zord.msgHide);
            h = $(document.createElement("div"));
            a ? h.html('<span class="text">' + a + "</span>") : h.addClass("hide-title");
            h.append(g).addClass("title");
            a = $(document.createElement("div")).addClass("popup-content");
            d.parent = null;
            b instanceof jQuery ? (b.show(), a.append(b)) : a.addClass("content").html(b);
            b = $(document.createElement("div"));
            b.addClass("footer");
            n.append(h).append(a);
            for (var r in c) a = $(document.createElement("button")), a.addClass("button"), a.html('<div class="icon-button"></div>' + r), a.on("click", c[r]).on("click", function() {
                Zord.msgHide()
            }), b.append(a), n.append(b), 12 === f && (a = $(document.createElement("div")), a.addClass("email-cadastrado"), a.html("<a href=\"javascript: displayEsqueciSenha('#email');\">Esqueceu sua senha? Clique aqui</a>"),
                n.append(a));
            $(document.body).append(n);
            setTimeout(function() {
                n.css({
                    left: "50%",
                    top: "50%",
                    marginLeft: "-" + parseInt(n.width() / 2) + "px",
                    marginTop: "-" + parseInt(n.height() / 2) + "px"
                }).show()
            });
            var s = $("input, button", n).get(0);
            s && setTimeout(function() {
                s.focus()
            });
            (c = n.find(".toast-error-ctn")) && c.hide();
            return n
        },
        msgIcon: function(a, b, c, d, g, l, f, k, m) {
            return this.msg(b, '<div class="emoticon ' + a + '">' + c + '</div><div class="msg">' + d + "</div>", g, l, f, k, m)
        },
        ask: function(a, b, c) {
            return this.msgIcon("", "Ei, espere um pouco!",
                "?", a, {
                    Sim: b,
                    "N\u00e3o": c
                })
        },
        erro: function(a, b, c) {
            return this.msgIcon("error", "Ooopss!!!", ":(", a, {
                OK: null
            }, c || null, null, null, b)
        },
        alertMessage: function(a, b, c, d) {
            a = a ? a : "#main-area";
            c = c ? c : "danger";
            d = d ? d : !0;
            $(".alert", a).remove();
            c = $(document.createElement("div")).addClass("alert alert-type-" + c);
            c.shake(5, 10, 10);
            c.append("<p>" + b + "</p>");
            !0 === d && (d = $('<span class="close-alert" title="Fechar mensagem">\u2716</span>'), c.append(d), d.on("click", Zord.alertMessageHide));
            $(a).prepend(c)
        },
        alertMessageHide: function() {
            var a =
                $(this).closest(".alert");
            a.fadeOut();
            setTimeout(function() {
                a.remove()
            }, 1E3)
        },
        unblock: function() {
            var a = $("#block").data("index-control");
            if (a)
                if (a.pop(), 0 < a.length) {
                    var b = a[a.length - 1];
                    $("#block").css("z-index", b);
                    $("#block").data("index-control", a)
                } else $("#block").remove();
            else $("#block").remove();
            $("#loading").remove()
        },
        set: function(a, e) {
            jQuery.isPlainObject(a) ? b = jQuery.extend(a, b) : b[a] = e;
            return this
        },
        get: function(a) {
            return b[a]
        },
        url: function(a, b) {
            var c = "/" + a;
            b && (c += "?operation=" + b);
            return c
        },
        valor: function(a) {
            return this.numberFormat(a, 2, ",", ".")
        },
        numberFormat: function(a, b, c, d) {
            a = (a + "").replace(/[^0-9+\-Ee.]/g, "");
            a = isFinite(+a) ? +a : 0;
            b = isFinite(+b) ? Math.abs(b) : 0;
            d = "undefined" === typeof d ? "," : d;
            c = "undefined" === typeof c ? "." : c;
            var g = "",
                g = function(a, c) {
                    var b = Math.pow(10, c);
                    return "" + (Math.round(a * b) / b).toFixed(c)
                },
                g = (b ? g(a, b) : "" + Math.round(a)).split(".");
            3 < g[0].length && (g[0] = g[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, d));
            (g[1] || "").length < b && (g[1] = g[1] || "", g[1] += Array(b - g[1].length + 1).join("0"));
            return g.join(c)
        },
        msgArea: function(a, b, c, d, g, l, f, k) {
            var m = this;
            return this.renderArea(a, b, c, d, function(a) {
                a = $(a);
                var c = m.msg(g, a, !1, !1, l, f);
                k && k.apply(null, [c, a])
            })
        },
        renderArea: function(a, b, c, d, g, l, f) {
            jQuery.isPlainObject(d) ? d.area = b : d = {
                area: b
            };
            return this.call(a, c, d, null, "html", l, f).done(g)
        },
        callArea: function(a, b, c, d, g, l, f) {
            g = g || "#" + b + "-area";
            return this.renderArea(a, b, c, d, function(a) {
                $(g).html(a)
            }, l, f)
        },
        reload: function() {
            Zord.block(!0);
            window.onbeforeunload = null;
            window.location = window.location
        },
        redir: function(a, b, c) {
            a = a || "";
            b = b || "";
            c = void 0 === c ? !0 : c;
            Zord.block(!0);
            window.onbeforeunload = null;
            var d = window.location.href.replace(/(https?:\/\/[^\/]*).*/, "$1");
            a = a.replace(d + "/", "");
            a = this.url(a, b);
            if (c && this.isSameDomain(a) || !c) window.location = a
        },
        isSameDomain: function(a) {
            var b = document.createElement("a");
            b.setAttribute("href", a);
            return (a = this.getHostNameFromUrl(b.href)) && window.location.hostname ? a == window.location.hostname.replace(/^www\./, "") : !1
        },
        getHostNameFromUrl: function(a) {
            a = a.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
            return null != a && 2 < a.length && "string" === typeof a[2] && 0 < a[2].length ? a[2] : null
        },
        getHashParam: function(a) {
            var b = {};
            window.location.hash.replace(/[\?&]([^=&]*)(?:=([^&]*))?/gi, function(a, d, g, l, f) {
                "undefined" === typeof g && (g = "");
                b[d] = decodeURIComponent(g.replace(/\+/g, " "))
            });
            return b[a] ? !0 : !1
        },
        lazyload: function(a) {
            a.on("mouseenter", function() {
                $(this).find("img").each(function() {
                    $(this).complete || $(this).attr("src", $(this).attr("data-src"))
                })
            })
        },
        centerHoverMenu: function(a, b) {
            setTimeout(function() {
                var c =
                    a.width(),
                    d = b.offset().left,
                    g = d + c;
                a.find("> li.has-childs, > li.has-child").each(function() {
                    var a = $(this),
                        b = a.width(),
                        e = a.find("> .container-menu").width(),
                        m = a.offset().left - d,
                        n = m;
                    a.offset().left + e > g && (n = m - e + b, 0 > n && (n = (c - e) / 2));
                    b = "" + Math.round(n) + "px";
                    a.find("> .container-menu").css("left", b)
                })
            }, 500)
        },
        call: function(a, b, c, d, g, l, f) {
            g = g || "json";
            f = f || "post";
            c = c || {};
            !1 !== l && this.block();
            var k = this;
            return jQuery[f](this.url(a, b), c, d, g).fail(function(a) {
                a.getResponseHeader("Magazord-Redir") ? k.erro(a.responseText,
                    a.getResponseHeader("Faderim-Exception-Code"),
                    function() {
                        var c = JSON.parse(a.getResponseHeader("Magazord-Redir"));
                        k.redir(c)
                    }) : a && a.responseText ? k.erro(a.responseText, a.getResponseHeader("Faderim-Exception-Code")) : 0 != a.readyState && console.warn("Erro ao buscar a requisi\u00e7\u00e3o")
            }).always(function() {
                !1 !== l && k.unblock()
            })
        },
        countdown: function(a) {
            zrd("countdown", a)
        },
        recognition: function(a, b) {},
        createToastErrorContainer: function(a) {
            a || (a = $("#main-area"));
            0 == a.find(".toast-error-ctn").length && (a.prepend('<div class="toast-error-ctn"><div class="toast-error"><div class="toast-text"></div><div class="toast-icon"></div></div></div>'),
                $(".toast-error-ctn").on("click", function() {
                    $(this).fadeOut()
                }));
            return a.find(".toast-error-ctn")
        },
        copy: function(a) {
            a = "string" === typeof a ? document.querySelector(a) : a;
            var b = !1;
            try {
                if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                    var c = a.contentEditable,
                        d = a.readOnly;
                    a.contentEditable = !0;
                    a.readOnly = !0;
                    var g = document.createRange();
                    g.selectNodeContents(a);
                    var l = window.getSelection();
                    l.removeAllRanges();
                    l.addRange(g);
                    a.setSelectionRange(0, 999999);
                    a.contentEditable = c;
                    a.readOnly = d
                } else a.select();
                b = document.execCommand("copy")
            } catch (f) {
                b = !1
            }
            return b
        },
        lazyLoad: function(a) {},
        readMore: function(a, b) {
            a.height() > b && (a.height(b), a.append('<a href="#" class="exibir-mais-conteudo-adicional">Leia mais \u00bb</a>'))
        },
        uniqueID: function(a) {
            a = a || "";
            var b = (Math.floor(25 * Math.random()) + 10).toString(36) + "_",
                b = b + ((new Date).getTime().toString(36) + "_");
            do b += Math.floor(35 * Math.random()).toString(36); while (32 > b.length);
            return a + "" + b
        }
    }
}();
Zord.analytics = function() {
    var b = null,
        d = {},
        a = {};
    return {
        sessionStorage: {
            set: function(a, c) {
                window.sessionStorage && window.sessionStorage.setItem(a, c)
            },
            get: function(a) {
                if (window.sessionStorage) return window.sessionStorage.getItem(a)
            },
            remove: function(a) {
                window.sessionStorage && window.sessionStorage.removeItem(a)
            }
        },
        registerPromo: function(a) {
            var c = [];
            a.each(function() {
                var a = $(this),
                    b = a.data("promoId"),
                    e = a.data("promo"),
                    d = a.data("tipo"),
                    k = {
                        id: b,
                        name: e,
                        position: "banner_slot" + d
                    };
                e && b && d && "undefined" !== typeof gtag &&
                    (c.push(k), a.on("click", function() {
                        gtag("event", "select_content", {
                            promotions: [k],
                            send_to: "analytics"
                        })
                    }))
            });
            "undefined" !== typeof gtag && gtag("event", "view_promotion", {
                promotions: c,
                send_to: "analytics"
            })
        },
        registerVitrine: function(a, c) {
            if ("undefined" !== typeof gtag) {
                var b = 0;
                a.each(function() {
                    var a = $(this);
                    b++;
                    var e = a.data("name");
                    if (e) {
                        var d = [];
                        a.find("li").each(function() {
                            var a = $(this),
                                b = a.data("id"),
                                g = {
                                    id: b,
                                    list: "vitrine-" + e,
                                    position: a.data("position")
                                };
                            c && (g.name = a.data("name"), g.brand = a.data("brand"),
                                g.variant = a.data("variant"));
                            b && (d.push(g), a.on("click", function() {
                                gtag("event", "select_content", {
                                    content_type: "product",
                                    send_to: "analytics",
                                    items: [g]
                                })
                            }))
                        });
                        gtag("event", "view_item_list", {
                            items: d,
                            send_to: "analytics"
                        })
                    }
                })
            }
        },
        hasStartedEvent: function(b) {
            return !0 === a[b]
        },
        registerEventReady: function(a, c) {
            return Zord.ready(function() {
                return Zord.analytics.registerEvent(a, c)
            })
        },
        registerEvent: function(b, c) {
            a[b] = !0;
            jQuery.isArray(d[b]) && jQuery.each(d[b], function() {
                try {
                    this.apply(null, [c])
                } catch (a) {
                    console.log("Erro ao disparar o evento",
                        b, a)
                }
            })
        },
        listenerEvent: function(a, c) {
            d[a] || (d[a] = []);
            d[a].push(c)
        },
        trackEvent: function(a, c, b) {
            "undefined" !== typeof gtag && gtag("event", c, {
                event_category: a,
                event_label: b,
                send_to: "analytics"
            })
        },
        setLastInteractionTime: function() {
            b = new Date
        },
        registerOnIdleEvent: function(a, c, d) {
            d = d || !1;
            $(window).on("mousemove", function() {
                Zord.analytics.setLastInteractionTime()
            });
            $(window).on("focus", function() {
                Zord.analytics.setLastInteractionTime()
            });
            b || this.setLastInteractionTime();
            var g = setInterval(function() {
                if (b) {
                    var l =
                        new Date;
                    l.getTime() - b.getTime() >= 1E3 * c && (a(), !1 === d && clearInterval(g), b = l)
                }
            }, 1E3)
        },
        pushState: function(a) {
            window.history.pushState({}, null, a);
            var b = Zord.get("GATag");

            b && gtag && gtag("config", b, {
                page_path: a
            })
        },
        registerBeforeLeaveEvent: function(a, b) {
            var d = 1,
                g = 0,
                l = 0,
                f = 5;
            a && (a.exitCountLimit && (d = a.exitCountLimit), a.mousePositionDelimiter && (f = a.mousePositionDelimiter));
            $(window).mousemove(function(a) {
                if (a.clientY <= f && l > f) {
                    if (g >= d) return;
                    g++;
                    b(a)
                }
                l = a.clientY
            })
        }
    }
}();
Zord.cookie = function() {
    return {
        set: function(b, d, a) {
            if (a) {
                var e = new Date;
                e.setTime(e.getTime() + 864E5 * a);
                a = "; expires=" + e.toGMTString()
            } else a = "";
            document.cookie = b + "=" + d + a + "; path=/"
        },
        setWs: function(b, d, a) {
            $.ajax({
                type: "POST",
                url: "/cookie.set",
                data: {
                    name: b,
                    value: d,
                    days: a
                }
            })
        },
        get: function(b) {
            if (0 < document.cookie.length) {
                var d = document.cookie.indexOf(b + "=");
                if (-1 != d) return d = d + b.length + 1, b = document.cookie.indexOf(";", d), -1 == b && (b = document.cookie.length), unescape(document.cookie.substring(d, b))
            }
            return ""
        },
        remove: function(b) {
            document.cookie = encodeURIComponent(b) + "=deleted; expires=" + (new Date(0)).toUTCString()
        }
    }
}();
Zord.produto = function() {
    return {
        calculaFrete: function(b, d) {
            b = b || !1;
            var a = $("#cep");
            a.attr("disabled", "disabled");
            var e = a.val();
            Zord.call("checkout/cart", "calculaFreteProduto", {
                codigo: $("#prod-codigo").val(),
                cep: e,
                preco: $("#prod-valor").val(),
                deposito: $("#prod-deposito").val(),
                quantidade: $("#prod-qtde").val()
            }, function(a) {
                var d = 0,
                    e = 0,
                    l;
                for (l in a.agencias) {
                    var f = a.agencias[l];
                    if (0 === d) {
                        var k = "Entrega para " + f.cep,
                            k = $("<h5 />").text(k),
                            m = $("#cep-response").hide();
                        m.empty().append(k)
                    }
                    d++;
                    0 < f.servico.length ?
                        ($(f.servico).each(function() {
                            var a = $('<div class="tipo-entrega" />'),
                                b = this.nome,
                                c = "",
                                c = 0 >= this.valor ? '<span class="frete-gratis">&nbsp;&nbsp;GR\u00c1TIS&nbsp;</span>' : '<span class="descricao-valor"> R$' + Zord.numberFormat(this.valor, 2, ",", ".") + "</span>",
                                b = '<span class="nome-servico">' + b + " - </span>" + c;
                            0 < this.prazoInicial && !this.dataPrevistaEntrega ? b += '<div class="tempo-entrega"> - de ' + this.prazoInicial + " \u00e0\u00a0 " + this.prazoFinal + " dias \u00fateis </div>" : this.dataPrevistaEntrega && (b += " - previsto entre <strong>" +
                                this.dataPrevistaEntrega + "</strong>");
                            a.html(b);
                            m.append(a);
                            this.msg && 0 < this.msg.length && m.append('<div class="msg-aviso-cep tipo-entrega">' + this.msg.join(",") + "</div>")
                        }), f.msg && 0 < f.msg.length && m.append('<div class="msg-aviso-cep tipo-entrega">' + f.msg.join(",") + "</div>")) : e++
                }
                a.agencias.length === e && (a = $('<div class="tipo-entrega"> N\u00e3o existe servi\u00e7o de transporte para a localidade informada</div>'), m.append(a));
                b && m.append('<div class="envio-pagamento">* Envio a partir de ' + b + ".</div>");
                m.append('<div class="fechar" style="display: none;">x</div>');
                $(".fechar").on("click", function() {
                    m.hide()
                });
                m.show(500)
            }, null, null, "get").always(function() {
                a.removeAttr("disabled")
            })
        },
        showImg: function(b, d, a) {
            var e = $(".area_video_you_tube");
            if (!e.is(":visible") || d) b = $(b), $("li.cycle-slide").removeClass("selected"), b.parent().addClass("selected"), $("a", b.parent().parent()).removeClass("selected"), b.addClass("selected"), e.empty(), e.hide(), $("figure", $(".img-area")).show(), $("#img-principal").attr("src",
                b.data().imgMax), $("#img-principal").attr("alt", b.find("img").attr("alt")), $("#img-principal").attr("data-img-full", b.data().imgFull), $("#img-principal").css("display", "initial"), a && (a.stopPropagation(), a.preventDefault())
        },
        showVideo: function(b, d) {
            var a = $(b),
                e = a.data().imgMax;
            if (e = this.getVideoYoutube(e, d)) $("a", a.parent().parent()).removeClass("selected"), a.addClass("selected"), $("figure", $(".img-area")).hide(), $(".area_video_you_tube").empty(), $(".area_video_you_tube").show(), $(".area_video_you_tube").append(e)
        },
        getVideoYoutube: function(b, d, a) {
            if (a) return $('<video style="position: absolute;left:0;top:0;" width="100%" height="100%" controls autoplay="false"><source src="' + b + '" type="video/mp4"></video>');
            var e;
            b.match(/v=(.*)/) ? e = b.match(/v=(.*)/) : b.match(/shorts(.*)/) && (e = b.match(/shorts(.*)/));
            if (e.indexOf(1)) return b = "//www.youtube.com/embed/" + e[1], d && (b += "?autoplay=1"), $('<iframe width="100%" height="100%" src="' + b + '" frameborder="0" allowfullscreen></iframe>');
            Zord.erro("Ocorreu um probleminha com este v\u00eddeo");
            return null
        },
        montaAreaDerivacaoCompreJunto2: function(b) {
            var d = $(".derivacao-compre-junto-area", b),
                a = d.data("variacao-size"),
                e = $(".select-derivacao-area-1 select", d);
            e.on("change", function() {
                var a = e.val();
                $(".select-derivacao-area-2 select", d).prop("selectedIndex", 0).hide();
                $(".select-derivacao-" + a, d).prop("selectedIndex", 0).show()
            });
            $(".select-derivacao-area-" + a + " select", d).on("change", function() {
                var a = $(this),
                    c = a.find(":selected"),
                    e = c.data("proder-id");
                e ? ($("#produto").val(e), $(".select-derivacao",
                    d).removeClass("selected"), a.addClass("selected"), $(".check_box_compre_junto", b).data("codigo-produto", c.data("codigo-produto")).data("deposito-compre-junto", c.data("deposito-produto")).data("valor", c.data("valor")).data("valor-de", c.data("valor-de")).data("valor-boleto", c.data("valor-boleto")).data("valor-pix", c.data("valor-pix")).data("conf-pagto", c.data("conf-pagto")), $(".ctn-val-valor-boleto", b).html("R$ " + Zord.numberFormat(c.data("valor-boleto"), 2, ",", ".")), $(".ctn-val-valor-cartao", b).html("R$ " +
                    Zord.numberFormat(c.data("valor"), 2, ",", ".")), $(".ctn-val-valor-pix", b).html("R$ " + Zord.numberFormat(c.data("valor-pix"), 2, ",", ".")), $(".ctn-val-valor-de", b).html("R$ " + Zord.numberFormat(c.data("valor-de"), 2, ",", ".")), Zord.produto.calculaCompreJuntoValores()) : (a = $(".select-derivacao-area", d).map(function() {
                    return $(this).data("variacao-nome")
                }).toArray(), a.pop(), Zord.alertMessage(d, "Antes de prosseguir com a compra, por favor selecione um(a) " + a.join("/") + "!"))
            });
            $(".check_box_compre_junto", b).on("change",
                function() {
                    if ($(this).data("codigo-produto")) Zord.produto.calculaCompreJuntoValores();
                    else {
                        this.checked = !1;
                        var a = $(".select-derivacao-area", d).map(function() {
                            return $(this).data("variacao-nome")
                        }).toArray();
                        Zord.alertMessage(d, "Antes de prosseguir com a compra, por favor selecione um(a) " + a.join("/") + "!")
                    }
                });
            var c = $(".derivacao-compre-junto-area", $(".produto-pai")),
                h = $(".select-derivacao-area-1 select", c),
                a = c.data("variacao-size");
            h.on("change", function() {
                var a = h.val();
                $(".select-derivacao-area-2 select",
                    c).prop("selectedIndex", 0).hide();
                $(".select-derivacao-" + a, c).prop("selectedIndex", 0).show()
            });
            $(".select-derivacao-area-" + a + " select", c).on("change", function() {
                var a = $(this),
                    b = a.find(":selected"),
                    e = b.data("proder-id");
                e ? ($("#produto").val(e), $(".select-derivacao", c).removeClass("selected"), $(".oferta-total-compre-junto").data("valor", b.data("valor")).data("valor-de", b.data("valorDe")).data("valor-boleto", b.data("valor-boleto")).data("valor-pix", b.data("valor-pix")).data("conf-pagto", b.data("conf-pagto")),
                    $(".preco-produto-pai .ctn-val-valor-boleto").html("R$ " + Zord.numberFormat(b.data("valor-boleto"), 2, ",", ".")), $(".preco-produto-pai .ctn-val-valor-cartao").html("R$ " + Zord.numberFormat(b.data("valor"), 2, ",", ".")), $(".preco-produto-pai .ctn-val-valor-pix").html("R$ " + Zord.numberFormat(b.data("valor-pix"), 2, ",", ".")), a.addClass("selected"), Zord.produto.calculaCompreJuntoValores()) : (a = $(".select-derivacao-area", c).map(function() {
                    return $(this).data("variacao-nome")
                }).toArray(), a.pop(), Zord.alertMessage(c,
                    "Antes de prosseguir com a compra, por favor selecione um(a) " + a.join("/") + "!"))
            })
        },
        montaAreaDerivacaoCompreJunto: function(b) {
            var d = $(".derivacao-compre-junto-area", b),
                a = d.data("variacao-size"),
                e = $(".select-derivacao-area-1 select", d);
            e.on("change", function() {
                var a = e.val();
                $(".select-derivacao-area-2 select", d).prop("selectedIndex", 0).hide();
                $(".select-derivacao-" + a, d).prop("selectedIndex", 0).show();
                $(".check_box_compre_junto", b).data("codigo-produto", null).data("deposito-compre-junto", null).data("valor",
                    null).data("valor-de", null).data("valor-boleto", null).data("valor-pix", null).data("conf-pagto", null);
                $(".check_box_compre_junto", d).attr("checked", !1)
            });
            $(".check_box_compre_junto", d).on("change", function() {
                if ($(this).data("codigo-produto")) Zord.produto.calculaCompreJuntoValores();
                else {
                    this.checked = !1;
                    var a = $(".select-derivacao-area", d).map(function() {
                        return $(this).data("variacao-nome")
                    }).toArray();
                    Zord.alertMessage(d, "Antes de prosseguir com a compra, por favor selecione um(a) " + a.join("/") + "!")
                }
            });
            $(".select-derivacao-area-" + a + " select", d).on("change", function() {
                var c = $(this),
                    e = c.find(":selected"),
                    g = e.data("proder-id");
                g ? ($("#produto").val(g), $(".variacao-area-" + a + " li", d).removeClass("selected"), c.addClass("selected"), $(".check_box_compre_junto", d).data("codigo-produto", e.data("codigo-produto")).data("deposito-compre-junto", e.data("deposito-produto")).data("valor", e.data("valor")).data("valor-de", e.data("valor-de")).data("valor-boleto", e.data("valor-boleto")).data("valor-pix", e.data("valor-pix")).data("conf-pagto",
                    e.data("conf-pagto")), $(".ctn-val-valor-cartao", b).html("R$ " + Zord.numberFormat(e.data("valor"), 2, ",", ".")), $(".ctn-val-valor-boleto", b).html("R$ " + Zord.numberFormat(e.data("valor-boleto"), 2, ",", ".")), $(".ctn-val-valor-pix", b).html("R$ " + Zord.numberFormat(e.data("valor-pix"), 2, ",", ".")), $(".ctn-val-valor-de", b).html("R$ " + Zord.numberFormat(e.data("valor-de"), 2, ",", ".")), Zord.produto.calculaCompreJuntoValores()) : (c = $(".select-derivacao-area", d).map(function() {
                        return $(this).data("variacao-nome")
                    }).toArray(),
                    c.pop(), Zord.alertMessage(d, "Antes de prosseguir com a compra, por favor selecione um(a) " + c.join("/") + "!"))
            });
            $(".check_box_compre_junto", d).on("change", function() {
                if ($(this).data("codigo-produto")) Zord.produto.calculaCompreJuntoValores();
                else {
                    this.checked = !1;
                    var a = $(".select-derivacao-area", d).map(function() {
                        return $(this).data("variacao-nome")
                    }).toArray();
                    Zord.alertMessage(d, "Antes de prosseguir com a compra, por favor selecione um(a) " + a.join("/") + "!")
                }
            })
        },
        calculaCompreJuntoValores: function() {
            var b =
                $(".oferta-total-compre-junto");
            if (0 != b.length) {
                var d = [];
                d.push({
                    codigo: $("#prod-codigo").val(),
                    deposito: parseInt($("#prod-deposito").val()),
                    valor: b.data("valor"),
                    valorBoleto: b.data("valor-boleto"),
                    valorPix: b.data("valor-pix"),
                    valorDe: b.data("valor-de"),
                    quantidade: 1,
                    confPagto: b.data("conf-pagto")
                });
                $(".check_box_compre_junto:checked").each(function(a, b) {
                    var h = $(b),
                        g = h.parent().parent().find(".input-quantidade-produtos-compre-junto").val() || 1;
                    d.push({
                        codigo: h.data("codigo-produto"),
                        deposito: h.data("deposito-compre-junto"),
                        valor: h.data("valor"),
                        valorDe: h.data("valor-de"),
                        valorBoleto: h.data("valor-boleto"),
                        valorPix: h.data("valor-pix"),
                        quantidade: g,
                        confPagto: h.data("conf-pagto")
                    })
                });
                var a = JSON.stringify(d);
                1 >= d.length ? b.hide() : (b.data("previewState", a), Zord.call("checkout/cart", "CalculaCompreJunto", {
                    produtos: d
                }, function(a) {
                    b.show();
                    b.html(a.html)
                }, null, !0))
            }
        }
    }
}();
Zord.checkout = function() {
    return {
        area: "itens",
        addCart: function(b, d, a, e, c) {
            b = b || $("#prod-codigo").val();
            d = d || $("#prod-deposito").val();
            a = a || $("#prod-qtde").val();
            e = e || $("#prod-anuncio").val();
            c = c || function() {
                Zord.redir("checkout/cart")
            };
            b = {
                codigo: b,
                deposito: d,
                quantidade: a,
                anuncio: e
            };
            Zord.analytics.registerEvent("addCart", [b]);
            Zord.call("checkout/cart", "add", b, c)
        },
        adicionarCarrinho: function(b, d, a) {
            b = b || $("#prod-codigo").val();
            return Zord.call("checkout/cart", "add", {
                codigo: b,
                deposito: d,
                quantidade: a
            })
        },
        addCarts: function(b, d) {
            d = d || function() {
                Zord.redir("checkout/cart")
            };
            Zord.analytics.registerEvent("addCart", b);
            Zord.call("checkout/cart", "AddMultiples", {
                produtos: b
            }, d)
        },
        deleteProduto: function(b, d) {
            Zord.ask("Voc\u00ea deseja excluir este produto do seu carrinho?", function() {
                return Zord.call("checkout/cart", "deleteProduto", {
                    codigo: b
                }, d)
            })
        },
        deleteItem: function(b, d) {
            var a = this,
                e = this.area,
                c = $("#" + b),
                h = c.data("name"),
                g = c.find("#product-img").attr("src");
            zrd("swal", function(c) {
                c.fire({
                    title: "Remover Produto",
                    html: '<span class="txt-sweetalert">Voc\u00ea realmente deseja remover este item do seu carrinho?</span><div class="flex center justify-center"><div class="box-info flex"><figure><img src="' + g + '" alt="' + h + '" width="96" height="96"></figure><div class="nome-preco"><span class="nome">' + h + "</span></div></div></div>",
                    width: 600,
                    padding: "1em",
                    showCancelButton: !0,
                    confirmButtonText: "Remover",
                    cancelButtonText: "Cancelar",
                    showCloseButton: !0,
                    customClass: {
                        container: "sweetalert-delete",
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger",
                        title: "title-sweetalert"
                    },
                    buttonsStyling: !1
                }).then(function(c) {
                    c.isConfirmed && (d ? Zord.call("checkout/cart", "deleteItem", {
                        id: b
                    }, d, "html") : (c = a.getParamsAtualizacaoCarrinho(), c.id = b, $("#frete-calculado").empty(), Zord.callArea("checkout/cart", e, "deleteItem", c)))
                })
            })
        },
        removeQuantidade: function(b, d) {
            if (1 >= parseFloat($("#item_carrinho_" + b).val())) return d ? Zord.Cart.removeItemSweetalert(b) : this.deleteItem(b);
            this.getParamsAtualizacaoCarrinho().id = b;
            $("#frete-calculado").empty();
            Zord.callArea("checkout/cart", this.area, "removeItem", {
                id: b
            })
        },
        adicionaQuantidade: function(b) {
            var d = this.getParamsAtualizacaoCarrinho();
            d.id = b;
            $("#frete-calculado").empty();
            Zord.callArea("checkout/cart", this.area, "adicionaItem", d)
        },
        removePersonalizacao: function(b) {
            var d = this.getParamsAtualizacaoCarrinho();
            d.id = b;
            var a = this.area;
            zrd("swal", function(b) {
                b.fire({
                    title: "Remover Personaliza\u00e7\u00e3o",
                    text: "Voc\u00ea deseja mesmo remover a personaliza\u00e7\u00e3o desse item?",
                    width: 600,
                    padding: "1em",
                    reverseButtons: !0,
                    showCancelButton: !0,
                    confirmButtonText: "Remover",
                    confirmButtonColor: "#fe354d",
                    confirmButtonBorderColor: "#fe354d",
                    cancelButtonText: "Cancelar",
                    cancelButtonColor: "#737373",
                    showCloseButton: !0
                }).then(function(b) {
                    b.isConfirmed && Zord.callArea("checkout/cart", a, "removePersonalizacao", d)
                })
            })
        },
        atualizaQuantidadeEspecificaCarrinho: function(b, d) {
            var a = this.getParamsAtualizacaoCarrinho();
            a.id = b;
            a.qtd = d;
            $("#frete-calculado").empty();
            Zord.callArea("checkout/cart", this.area, "adicionaItem", a)
        },
        itemPresente: function(b) {
            var d =
                $("#presente_" + b).get(0).checked;
            Zord.callArea("checkout/cart", this.area, "presente", {
                id: b,
                presente: d
            })
        },
        atualizaPresenteItem: function(b) {
            var d = $("#presente_" + b).get(0).checked;
            Zord.callArea("checkout/cart", this.area, "presenteItem", {
                idItemCarrinho: b,
                presente: d
            })
        },
        presente: function() {
            var b = this.getParamsAtualizacaoCarrinho();
            b.presente = $("#presente").prop("checked");
            Zord.callArea("checkout/cart", this.area, "presente", b)
        },
        atualizaListaItensPresente: function() {
            var b = this.getParamsAtualizacaoCarrinho();
            b.presente = !0;
            Zord.callArea("checkout/cart", this.area, "presente", b)
        },
        addCupomDesconto: function() {
            $("#cupom-desconto").val() ? this.atualizaValoresCarrinho() : Zord.erro("Informe o cupom de desconto!")
        },
        removeCupomDesconto: function() {
            $("#cupom-desconto").val("");
            this.atualizaValoresCarrinho()
        },
        getParamsAtualizacaoCarrinho: function() {
            var b = null,
                d = {};
            if (b = $("#cep")) d.cep = b.val();
            $("input.input_frete_envio").each(function() {
                this.checked && (d[this.name] = this.value)
            });
            if (b = $("#cupom-desconto")) d["cupom-desconto"] =
                b.val();
            return d
        },
        atualizaValoresCarrinho: function() {
            Zord.callArea("checkout/cart", this.area, "atualizaValoresCarrinho", this.getParamsAtualizacaoCarrinho())
        },
        continuarComprando: function(b) {
            Zord.analytics.sessionStorage.get("keepbuying") ? b ? window.location.reload() : navigator.userAgent.match(/Macintosh|iPad|iPod|iPhone/i) ? (history.go(-1), navigator.app.backHistory()) : window.history.back() : Zord.redir("")
        },
        atualizaPreview: function(b) {
            b = "undefined" == typeof b ? !0 : !1;
            if (!Zord.get("cart.preview") && 0 < Zord.get("cart.size") ||
                b) {
                Zord.set("cart.preview", !0);
                var d = $(".carrinho-rapido", "#cart-preview-area");
                0 != d.length && (d.addClass("loading").empty(), Zord.call("cliente", "getInfoExtra", {
                    preview: !0
                }, function(a) {
                    d.removeClass("loading");
                    a.preview && d.html(a.preview)
                }, null, !1))
            }
        }
    }
}();

function onSubmitRecaptcha(b) {
    Zord.erro("N\u00e3o foi poss\u00edvel processar o Recaptcha(2). Verifique sua conex\u00e3o com a Internet e tente novamente em alguns segundos!")
}

function onErrorRecaptcha() {
    Zord.erro("N\u00e3o foi poss\u00edvel processar o Recaptcha. Verifique sua conex\u00e3o com a Internet e tente novamente em alguns segundos!")
}
Zord.form = function(b) {
    var d = "name",
        a = {},
        e = $(b),
        c = !1;
    e.get(0) ? e.get(0).instance = this : console.log("Erro");
    var h = 0,
        g, l, f, k, m, n, r, s = !1,
        v = [];
    this.submitTo = function(a, b, c, e) {
        k = a;
        m = b;
        n = c;
        r = e
    };
    this.setSubmitComplete = function(a) {
        n = a
    };
    this.addField = function(b, c) {
        a[b] = c;
        return this
    };
    this.usaValidacaoPersonalizada = function(a) {
        c = a
    };
    this.modifyField = function(b, c) {
        a[b] = jQuery.extend({}, a[b], c);
        return this
    };
    this.validateRemote = function(a) {
        g = a
    };
    this.setPropertyFind = function(a) {
        d = a
    };
    this.triggerDisplay = function(c) {
        var e =
            this.getFormValue(),
            g = this;
        jQuery.each(a, function(a) {
            var f = $("[" + d + '="' + a + '"]', b),
                h = f.parent();
            this.display && (this.display(e) ? h.show() : h.hide());
            g.isRequiredField(this) ? $('label[for="' + a + '"]', h).addClass("required").removeClass("non-required") : $('label[for="' + a + '"]', h).addClass("non-required").removeClass("required");
            !1 !== c && (a = g.validateField(f, this), g.hideErrorMessage(), g.showErrorMessage(a.valid, a.message, a.toast))
        })
    };
    this.getField = function(a) {
        return $("[" + d + '="' + a + '"]', e)
    };
    this.init = function() {
        var b =
            this;
        jQuery.each(a, function(a) {
            var c = this,
                d = b.getField(a);
            d.on(c.event);
            c.mask && ("function" === typeof c.mask ? c.mask(d, {
                onComplete: function() {
                    c.maskBlur && $("#" + c.maskBlur, e).focus()
                },
                clearIfNotMatch: !0
            }) : (a = {
                onComplete: function() {
                    c.maskBlur && $("#" + c.maskBlur, e).focus()
                },
                clearIfNotMatch: !0
            }, $.extend(a, c.maskOptions), d.mask(c.mask, a)));
            if (c.hint) {
                a = c.hintType || "both";
                var g = d.parent();
                if ("balloon" === a.toLowerCase() || "both" === a.toLowerCase()) {
                    var f = $('<span class="hint"><span class="hint-float">' + c.hint +
                        "</span></span>");
                    f.on("mouseenter", function() {
                        $("span", f).stop().show(300)
                    }).on("mouseleave", function() {
                        $("span", f).stop().hide({
                            duration: 300,
                            complete: function() {
                                $(this).attr("style", "display: none;")
                            }
                        })
                    });
                    $("label", d.parent()).append(f)
                }
                if ("bottom" === a.toLowerCase() || "both" === a.toLowerCase()) {
                    var h = $("<div />");
                    h.addClass("hint-fixed");
                    h.html(c.hint);
                    g.append(h);
                    d.focus(function() {
                        h.fadeIn(500)
                    }).on("blur", function() {
                        h.fadeOut(500)
                    })
                }
            }
            c.remoteValidate && (d.attr("remoteValidateResult", "-2"), d.on("change",
                function(a) {
                    d.attr("remoteValidateResult", "-2")
                }));
            d.on("blur", function(a) {
                "undefined" !== typeof a.originalEvent && $(a.originalEvent.explicitOriginalTarget).is("button[type=submit]") || $(a.relatedTarget).is("button[type=submit]") || (b.validateField(d, c), b.hideErrorMessage())
            })
        });
        b = this;
        this.getForm().on("submit", function(a) {
            l && l();
            return b.send()
        });
        this.getForm().on("reset", function() {
            b.clearWarnings()
        });
        this.triggerDisplay(!1);
        return this
    };
    this.setUseRecaptcha = function(a) {
        s = a
    };
    this.clearWarnings = function() {
        this.getForm().find(".field-valid, .field-invalid").removeClass("field-valid").removeClass("field-invalid");
        this.getForm().find(".msg-error").remove()
    };
    this.isRequiredField = function(a) {
        if (jQuery.isFunction(a.required)) {
            var b = this.getFormValue();
            return a.required(b)
        }
        return !0 === a.required
    };
    this.findToast = function(a) {
        var b = $(".toast-error-ctn");
        if (a) {
            var c = a.closest(".default-form");
            c.length || (c = a.closest("form"));
            b = c.parent().find(".toast-error-ctn");
            b.length || (b = this.createToastErrorContainer(c.parent()))
        }
        return b
    };
    this.validateField = function(a, b) {
        function c(b) {
            a.removeClass("field-valid").removeClass("field-invalid");
            !0 === b ? a.addClass("field-valid") : !1 === b && a.addClass("field-invalid")
        }

        function e(g) {
            try {
                f = b.remoteValidate(g, a), c(f), n = ""
            } catch (l) {
                n = l.message, f = !1, c(f)
            } finally {
                h--
            }
            f ? (a.attr("remoteValidateResult", "1"), a.attr("remoteValidateResultMsg", "")) : (a.attr("remoteValidateResult", "0"), a.attr("remoteValidateResultMsg", n));
            k.showErrorMessage(f, n, d)
        }
        var d = this.findToast(a),
            f = null,
            k = this;
        if (b.personalValidation)(f = b.personalValidation(a, b)) || (n = "Alguns campos obrigat\u00f3rios n\u00e3o foram preenchidos!");
        else {
            var l =
                a.val() || "",
                m = this.isRequiredField(b),
                n;
            try {
                if (m) {
                    if (null === l || 0 == l.length) throw Error("Alguns campos obrigat\u00f3rios n\u00e3o foram preenchidos!");
                    f = !0
                }(!m && 0 < l.length || !0 === f) && b.validate && (f = b.validate(l))
            } catch (r) {
                f = !1, n = r.message
            }
        }
        f && b.remoteValidate ? (m = a.attr("remoteValidateResult"), "-2" === m || void 0 === m ? (h++, a.attr("remoteValidateResult", "-1"), b.customRemoteValidateFn ? b.customRemoteValidateFn(this, a, e) : Zord.call(g, "validate", {
            field: a.attr("name"),
            value: l
        }, e)) : "1" === m ? f = !0 : "0" === m && (f = !1, n ||
            (n = a.attr("remoteValidateResultMsg")))) : c(f);
        return {
            valid: f,
            message: n,
            toast: d
        }
    };
    this.getForm = function() {
        return e.find("form")
    };
    this.customValidate = null;
    this.addCustomValidate = function(a) {
        v.push(a)
    };
    this.hideErrorMessage = function() {
        setTimeout(function() {
            $(".toast-error-ctn").fadeOut()
        }, 200)
    };
    this.showErrorMessage = function(a, b, e) {
        if (c) a = Swal.mixin({
            toast: !0,
            position: "top",
            showConfirmButton: !1,
            timer: 3E3,
            timerProgressBar: !0,
            didOpen: function(a) {
                a.addEventListener("mouseenter", Swal.stopTimer);
                a.addEventListener("mouseleave",
                    Swal.resumeTimer)
            }
        }), "" !== b && null !== b && a.fire({
            icon: "error",
            iconColor: "#fff",
            color: "#fff",
            background: "#FF1D23",
            title: b
        });
        else if (e && "" !== b && $("html, body").animate({
                scrollTop: e.parent().offset().top - 2 * $("header").height()
            }, "slow"), !a) {
            if (null == b || "" == b) b = "Alguns campos obrigat\u00f3rios n\u00e3o foram preenchidos!";
            if (null == e || "undefined" == e) e = $(".toast-error-ctn");
            setTimeout(function() {
                e.show();
                e.find(".toast-text").html(b);
                e.fadeOut();
                e.fadeIn()
            }, 200)
        }
    };
    this.createToastErrorContainer = function(a) {
        return Zord.createToastErrorContainer(a)
    };
    this.validate = function() {
        var b = this,
            c = !0,
            f = null,
            g = null;
        jQuery.each(a, function(a) {
            a = b.validateField($("[" + d + '="' + a + '"]', e), this);
            !1 === a.valid && (c = !1, null == f && (f = a.message), g = a.toast)
        });
        if (c && this.customValidate) try {
            this.customValidate(this) || (c = !1)
        } catch (h) {
            c = !1, f = h.message
        }
        if (c && v)
            for (var k = 0; k < v.length; k++) try {
                if (!v[k](this)) {
                    c = !1;
                    break
                }
            } catch (l) {
                c = !1, f = l.message
            }
        this.hideErrorMessage();
        this.showErrorMessage(c, f, g);
        return c
    };
    this.getFormValue = function() {
        var b = this.getForm().find(":disabled").prop("disabled",
                !1),
            c = this.getForm().serializeArray(),
            f = {};
        jQuery.each(c, function() {
            f[this.name] = this.value.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        });
        "id" == d && jQuery.each(a, function(a) {
            f[a] || (f[a] = $("[" + d + '="' + a + '"]', e).val())
        });
        b.prop("disabled", !0);
        for (b = 0; b < this.fixedData.length; b++) f[this.fixedData[b].name] = "function" == typeof this.fixedData[b].value ? this.fixedData[b].value() : this.fixedData[b].value;
        return f
    };
    this.fixedData = [];
    this.addFixedDataForm = function(a, b) {
        this.fixedData.push({
            name: a,
            value: b
        })
    };
    this.setBeforeSend =
        function(a) {
            l = a
        };
    this.setTrataValorForm = function(a) {
        f = a
    };
    this.send = function() {
        var a = this,
            b = this.validate();
        return b && h ? (setTimeout(function() {
            a.send()
        }, 200), !1) : function() {
            var c = a.getFormValue();
            if (s && !0 === b)
                if (a.recaptchaToken) c.__rc = a.recaptchaToken;
                else {
                    if (!window.grecaptcha) return Zord.erro("N\u00e3o foi poss\u00edvel carregar o Recaptcha, entre em contato com o atendimento."), !1;
                    window.onSubmitRecaptcha = function(b) {
                        a.recaptchaToken = b;
                        a.send()
                    };
                    grecaptcha.execute();
                    return !1
                } if (!0 === b)
                if (f && f(c),
                    k) $("button", e).prop("disabled", !0), Zord.call(k, m, c, n).always(function() {
                    s && (a.recaptchaToken = null, grecaptcha.reset());
                    $("button", e).prop("disabled", !1)
                });
                else return Zord.block(!0), window.onbeforeunload = null, !0;
            else r && r(c);
            return !1
        }()
    };
    this.reset = function() {
        this.getForm().trigger("reset")
    }
};
Zord.form.instance = function(b) {
    return $(b).get(0).instance
};
Zord.Util = {
    validator: {
        cpfValido: function(b) {
            b = b.replace(/[^\d]+/g, "");
            if ("" == b || 11 != b.length || "00000000000" == b || "11111111111" == b || "22222222222" == b || "33333333333" == b || "44444444444" == b || "55555555555" == b || "66666666666" == b || "77777777777" == b || "88888888888" == b || "99999999999" == b) return !1;
            for (var d = 0, a = 0; 9 > a; a++) d += parseInt(b.charAt(a)) * (10 - a);
            d = 11 - d % 11;
            if (10 == d || 11 == d) d = 0;
            if (d != parseInt(b.charAt(9))) return !1;
            for (a = d = 0; 10 > a; a++) d += parseInt(b.charAt(a)) * (11 - a);
            d = 11 - d % 11;
            if (10 == d || 11 == d) d = 0;
            return d != parseInt(b.charAt(10)) ?
                !1 : !0
        },
        emailValido: function(b) {
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(b)
        },
        cnpjValido: function(b) {
            b = b.replace(/[^\d]+/g, "");
            if ("" == b || 14 != b.length || "00000000000000" == b || "11111111111111" == b || "22222222222222" == b || "33333333333333" == b || "44444444444444" == b || "55555555555555" == b || "66666666666666" == b || "77777777777777" == b || "88888888888888" == b || "99999999999999" == b) return !1;
            for (var d = b.length - 2, a = b.substring(0, d), e = b.substring(d), c = 0, h = d - 7, g = d; 1 <= g; g--) c += a.charAt(d - g) * h--,
                2 > h && (h = 9);
            if ((2 > c % 11 ? 0 : 11 - c % 11) != e.charAt(0)) return !1;
            d += 1;
            a = b.substring(0, d);
            c = 0;
            h = d - 7;
            for (g = d; 1 <= g; g--) c += a.charAt(d - g) * h--, 2 > h && (h = 9);
            return (2 > c % 11 ? 0 : 11 - c % 11) != e.charAt(1) ? !1 : !0
        },
        ieValido: function(b, d) {
            return void 0 == d || 2 != d.length ? !1 : inscricaoEstadual(b, d)
        }
    },
    mask: {
        foneMask: function(b, d) {
            var a = function(a) {
                return 11 <= a.replace(/\D/g, "").length ? "(00) 00000-0000" : "(00) 0000-00009"
            };
            d = {
                onKeyPress: function(b, c, d, g) {
                    d.mask(a.apply({}, arguments), g)
                }
            };
            $(b).mask(a, d)
        },
        celularMask: function(b, d) {
            d = d || {};
            b.mask("(00) 00000-0000", d)
        },
        cepMask: function(b, d) {
            d = d || {};
            b.css("text-align", "right");
            b.mask("00000-000", d)
        }
    },
    onlyNumber: function(b) {
        return (new String(b)).replace(/[^\d]+/g, "")
    },
    round: function(b, d, a) {
        var e, c, h;
        d = Math.pow(10, d | 0);
        b *= d;
        h = 0 < b | -(0 > b);
        c = b % 1 === .5 * h;
        e = Math.floor(b);
        if (c) switch (a) {
            case "PHP_ROUND_HALF_DOWN":
                b = e + (0 > h);
                break;
            case "PHP_ROUND_HALF_EVEN":
                b = e + e % 2 * h;
                break;
            case "PHP_ROUND_HALF_ODD":
                b = e + !(e % 2);
                break;
            default:
                b = e + (0 < h)
        }
        return (c ? b : Math.round(b)) / d
    },
    str_repeat: function(b, d) {
        for (var a =
                "";;)
            if (d & 1 && (a += b), d >>= 1) b += b;
            else break;
        return a
    },
    firstWord: function(b) {
        var d = b.indexOf(" ");
        return -1 === d ? b : b.substr(0, d)
    },
    lastWord: function(b) {
        b = b.split(" ");
        return b[b.length - 1]
    },
    slugify: function(b) {
        return b.toString().toLowerCase().normalize("NFD").trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-")
    }
};
Zord.meusDados = function() {
    return {
        eventEndereco: function(b) {
            $('.endereco [name="alterar"]', b).each(function(b, a) {
                $(a).on("click", function() {
                    var a = $(this).closest(".endereco").data("id");
                    a ? $(this).is(".mobile") ? Zord.redir("cliente/dados/endereco?id=" + a) : Zord.msgArea("cliente/dados/endereco", "conteudo", null, {
                        id: a
                    }, "Editar Endere\u00e7o") : alert("N\u00e3o foi poss\u00edvel encontrar o Endere\u00e7o para edi\u00e7\u00e3o")
                })
            });
            $('.endereco [name="excluir"]:not(.disabled)', b).each(function(b, a) {
                $(a).on("click",
                    function() {
                        var a = $(this).closest(".endereco").data("id");
                        Zord.ask("Deseja realmente excluir o endere\u00e7o?", function() {
                            Zord.call("cliente", "excluirEndereco", {
                                codigo: a
                            }, function(a) {
                                "error" === a.status ? Zord.erro(a.message) : (Zord.msg("Exclus\u00e3o", a.message, {}, function() {
                                    Zord.reload()
                                }), setTimeout(Zord.reload, 2E3))
                            })
                        })
                    })
            })
        }
    }
}();
Zord.File = function() {
    return {
        validaCampoFile: function(b, d, a, e, c, h) {
            var g = b.prop("files"),
                l = this.getFileNames(g);
            try {
                this.validaQuantidadeMaximaArquivos(g, a), this.validaExtensaoArquivos(g, e), this.validaTamanhoArquivos(g, c), this.validaTamanhoTotalArquivos(g, h), d.text(l.join(", "))
            } catch (f) {
                Zord.erro(f.message, null, function() {
                    b.val(null);
                    d.text("Escolher arquivos")
                })
            }
        },
        getFileNames: function(b) {
            return $.map(b, function(b) {
                return b.name
            })
        },
        getTamanhoTotalArquivos: function(b) {
            var d = 0;
            $.each(b, function(a,
                b) {
                d += b.size
            });
            return d
        },
        bytesToHumanReadable: function(b) {
            var d = -1;
            do b /= 1024, d++; while (1024 <= b);
            return Math.max(b, .1).toFixed(1) + " kB; MB; GB; TB;PB;EB;ZB;YB".split(";")[d]
        },
        humanReadableToBytes: function(b) {
            if (b) {
                var d = b.match(/[0-9]+/);
                b = b.match(/[A-Z]/i);
                if (d && b && (d = parseInt(d[0]), b = b[0].toLowerCase(), b = "kmgtpezy".split("").indexOf(b), -1 != b)) return d * Math.pow(1024, b + 1)
            }
        },
        validaQuantidadeMaximaArquivos: function(b, d) {
            if (b.length > d) throw Error("A quantidade de arquivos selecionados excede o m\u00e1ximo permitido de " +
                d + " arquivos!");
        },
        validaTamanhoArquivos: function(b, d) {
            var a = this,
                e = 1024 * d;
            $.each(b, function(b, d) {
                var g = d.size;
                if (g > e) {
                    var l;
                    l = "" + ("O arquivo " + d.name + " n\u00e3o pode ser anexado pois ultrapassa o tamanho m\u00e1ximo permitido! ");
                    l += "Tamanho do Arquivo: " + a.bytesToHumanReadable(g) + ". ";
                    l += "Tamanho M\u00e1ximo Permitido: " + a.bytesToHumanReadable(e) + ".";
                    throw Error(l);
                }
            })
        },
        validaExtensaoArquivos: function(b, d) {
            if (d && d.length) {
                var a = new RegExp("." + d.join("|") + "$", "i");
                $.each(b, function(b, c) {
                    if (!a.test(c.name)) {
                        var h =
                            "O arquivo " + c.name + " n\u00e3o pode ser anexado pois sua extens\u00e3o n\u00e3o \u00e9 v\u00e1lida! Extens\u00f5es permitidas: " + d.join(",");
                        throw Error(h);
                    }
                })
            }
        },
        validaTamanhoTotalArquivos: function(b, d) {
            var a = this.getTamanhoTotalArquivos(b),
                e = this.humanReadableToBytes(d);
            if (e && a >= e) {
                a = this.bytesToHumanReadable(e);
                if (1 == b.length) throw Error("O arquivo selecionado excede o tamanho m\u00e1ximo permitido de " + a + "!");
                throw Error("Os arquivos selecionados excedem o tamanho m\u00e1ximo permitido de " + a +
                    "!");
            }
        }
    }
}();
Zord.Gateway = function() {
    return {
        openBoletoItauShopline: function(b, d) {
            var a = document.createElement("input");
            a.setAttribute("name", "dc");
            a.setAttribute("type", "hidden");
            a.setAttribute("value", d);
            var e = document.createElement("form");
            e.setAttribute("method", "POST");
            e.setAttribute("accept-charset", "utf-8");
            e.setAttribute("target", "_blank");
            e.setAttribute("action", b);
            e.appendChild(a);
            document.body.appendChild(e);
            e.submit();
            document.body.removeChild(e)
        },
        openBoletoUrl: function(b) {
            window.open(b, "_blank", "toolbar=yes,menubar=yes,resizable=yes,status=no,scrollbars=yes,width=815,height=575")
        },
        showBCashContract: function() {
            window.open("https://www.bcash.com.br/checkout2/pay/contrato", "termos-bcash", "width=700, height=500, scrollbars=yes, status=no, toolbar=no, location=no, directories=no, menubar=no")
        }
    }
}();
Zord.Tracking = function() {
    return {
        trackSession: function() {
            if (!Zord.cookie.get("_ses")) {
                var b = new URL(document.location),
                    b = {
                        start_buy: Math.floor((new Date).getTime() / 1E3),
                        pe: b.pathname
                    };
                Zord.cookie.set("_ses", Zord.Tracking.encode(jQuery.param(b)))
            }
        },
        trackRemote: function(b) {
            $.ajax({
                type: "POST",
                url: "/cliente/trackRemote",
                data: $.extend(b, {
                    location: String(document.location),
                    referrer: String(document.referrer)
                })
            })
        },
        track: function() {
            var b = new URL(document.location),
                d = document.referrer ? new URL(document.referrer) :
                null,
                a = !1;
            b.searchParams.get("utm_source") || b.searchParams.get("utm_zanpid") || b.searchParams.get("utm_gclid") || b.searchParams.get("ranMID") ? a = !0 : d && d.hostname != b.hostname && (a = !0);
            a && $.ajax({
                type: "POST",
                url: "/tracking.set",
                data: {
                    location: String(document.location),
                    referrer: String(document.referrer)
                }
            })
        },
        encode: function(b) {
            return btoa(b.reverse())
        }
    }
}();

function getUrlParams(b) {
    var d = {};
    window.location.search.replace(/[\?&]([^=&]*)(?:=([^&]*))?/gi, function(a, b, c, h, g) {
        "undefined" === typeof c && (c = "");
        d[b] = decodeURIComponent(c.replace(/\+/g, " "))
    });
    return b ? d[b] : d
}

function removeUrlParam(b, d) {
    var a = d.split("?")[0],
        e, c = [];
    e = -1 !== d.indexOf("?") ? d.split("?")[1] : "";
    if ("" !== e) {
        for (var c = e.split("&"), h = c.length - 1; 0 <= h; h -= 1) e = c[h].split("=")[0], e === b && c.splice(h, 1);
        a = a + "?" + c.join("&")
    }
    return a
}
$(function() {
    function b(a) {
        var b = null;
        $(a).siblings(".msg-error").length && (b = setTimeout(function() {
            $(a).siblings(".msg-error").fadeOut({
                complete: function() {
                    $(".msg-error", $(a).parent()).remove();
                    $(a).removeClass("field-invalid")
                }
            })
        }, 2E3));
        return b
    }
    $(document).on("change", "select#ordem", function() {
        var a = getUrlParams(),
            b;
        for (b in a) "ordem" !== b && $(this).parent("form").prepend($('<input type="hidden" name="' + b + '" value="' + a[b] + '" />'));
        "" == this.value ? window.location.href = window.location.pathname : $(this).parent("form").submit()
    });
    var d, a;
    if ($("#form-newsletter").length) {
        var e = new Zord.form("#form-newsletter");
        e.addField("nome", {
            required: !0,
            validate: function(a) {
                if (3 > (new String(a)).length) throw Error("O nome deve possuir ao menos 3 caracteres.");
                return !0
            },
            event: {
                blur: function() {
                    var a = this;
                    clearTimeout(d);
                    setTimeout(function() {
                        d = b(a)
                    }, 100)
                }
            }
        }).addField("email", {
            required: !0,
            validate: function(a) {
                if (!Zord.Util.validator.emailValido(a)) throw Error("Deve ser informado um e-mail v\u00e1lido.");
                return !0
            },
            event: {
                blur: function() {
                    var c =
                        this;
                    clearTimeout(a);
                    setTimeout(function() {
                        a = b(c)
                    }, 100)
                }
            }
        });
        e.submitTo("newsletter", "addNewsletter", function(a, b, d) {
            "success" === a.status ? (window._edrone && (window._edrone = window._edrone || {}, _edrone.customer_tags = "Footer", _edrone.email = $('#form-newsletter input[name="email"]').val(), _edrone.first_name = $('#form-newsletter input[name="nome"]').val(), _edrone.action_type = "subscribe", _edrone.init()), Zord.redir("newsletter?url=" + encodeURIComponent(window.location.href))) : "error" === a.status && Zord.erro(a.message)
        });
        e.init()
    }
    $(".avise-me").length && (e = new Zord.form("#form-avise-me"), e.addField("telefone", {
            mask: Zord.Util.mask.foneMask
        }).addField("email", {
            hint: "Voc\u00ea ser\u00e1 avisado somente da chegada do produto.",
            hintType: "balloon",
            validate: function(a) {
                if (!Zord.Util.validator.emailValido(a)) throw Error("Deve ser informado um e-mail v\u00e1lido.");
                return !0
            },
            required: !0
        }).addField("nome", {
            validate: function(a) {
                if (3 > (new String(a)).length) throw Error("O nome deve possuir ao menos 3 caracteres.");
                return !0
            },
            required: !0
        }),
        e.submitTo("newsletter", "addAviseMe", function(a, b, d) {
            "success" === a.status ? (Zord.msg("Cadastro efetuado", a.message), $("form", "#form-avise-me").find("input[type=text], input[type=email], textarea").val("")) : "error" === a.status && Zord.erro(a.message)
        }), e.init())
});
jQuery.fn.shake = function(b, d, a) {
    this.each(function() {
        var e = $(this);
        e.css("position", "relative");
        for (var c = 1; c <= b; c++) e.animate({
            left: -1 * d
        }, a / b / 4).animate({
            left: d
        }, a / b / 2).animate({
            left: 0
        }, a / b / 4)
    });
    return this
};
Zord.ready(function() {
    $("#search").on("mouseover focus", function() {
        $(this.parentNode).addClass("focus")
    }).on("mouseout blur", function() {
        $(this.parentNode).removeClass("focus")
    });
    window.onbeforeunload = function() {
        if (0 < parseFloat(Zord.get("cart.size")) && window.location.href && -1 < window.location.href.indexOf("checkout") && -1 == window.location.href.indexOf("done")) return "Voc\u00ea deixou alguns itens no carrinho e sua compra ainda n\u00e3o foi finalizada"
    };
    $("body").on("click", ".prevent-default", function(b) {
        b.preventDefault()
    });
    if ($(".toast-error-ctn")) $(".toast-error-ctn").on("click", function() {
        $(this).fadeOut()
    });
    document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") ? $(document.documentElement).addClass("svg") : $(document.documentElement).addClass("no-svg")
});
String.prototype.trim || (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "")
});
String.prototype.lpad || (String.prototype.lpad = function(b, d) {
    for (var a = this.toString(); a.length < b;) a = d.toString() + a;
    return a
});
String.prototype.reverse || (String.prototype.reverse = function() {
    return this.split("").reverse().join("")
});