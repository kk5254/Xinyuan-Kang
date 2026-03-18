/**
 * Computational Inequality Storyboard - Interactive Scripts
 * 计算不平等故事板 - 交互脚本
 * 
 * 功能说明 / Features:
 * - Panel 3: Hand position confidence simulation (手势位置置信度模拟)
 * - Panel 4: Threshold governance visualization (阈值治理可视化)
 * - Smooth scrolling navigation (平滑滚动导航)
 * - Scroll progress bar (滚动进度条)
 * - Fixed navigation with highlighting (固定导航栏高亮)
 * - Image lightbox (图片放大查看)
 * - Fade-in animations (淡入动画)
 */

// ========================================
// Panel 3: Confidence Simulation - 置信度模拟
// ========================================

/**
 * 初始化手势位置滑块交互
 * Initialize hand position slider interaction
 */
function initConfidenceDemo() {
    const slider = document.getElementById('handPosition');
    const handDownBar = document.getElementById('handDownBar');
    const handUpBar = document.getElementById('handUpBar');
    const handDownPercent = document.getElementById('handDownPercent');
    const handUpPercent = document.getElementById('handUpPercent');
    const prediction = document.getElementById('prediction');

    if (!slider) return; // 如果元素不存在则退出 / Exit if element not found

    function updateConfidence() {
        const position = parseInt(slider.value);
        
        // 计算置信度 / Calculate confidence
        // 0 = Hand Down (100%), 50 = Uncertain (50/50), 100 = Hand Up (100%)
        let handDownConf, handUpConf;
        
        if (position <= 40) {
            // 明确的手放下区域 / Clear hand down region
            handDownConf = 100 - (position * 0.5);
            handUpConf = position * 0.5;
        } else if (position >= 60) {
            // 明确的手举起区域 / Clear hand up region
            handDownConf = (100 - position) * 0.5;
            handUpConf = 100 - ((100 - position) * 0.5);
        } else {
            // 边界区域 - 不稳定 / Boundary region - unstable
            // 模拟标签翻转行为 / Simulate label flipping behavior
            const variance = Math.sin(position * 0.5) * 15;
            handDownConf = 50 + variance;
            handUpConf = 50 - variance;
        }
        
        // 更新显示 / Update display
        handDownBar.style.width = handDownConf + '%';
        handUpBar.style.width = handUpConf + '%';
        handDownPercent.textContent = Math.round(handDownConf) + '%';
        handUpPercent.textContent = Math.round(handUpConf) + '%';
        
        // 更新预测文本 / Update prediction text
        if (handDownConf > 70) {
            prediction.textContent = 'Prediction: Hand Down (Stable)';
            prediction.style.color = '#0099ff';
        } else if (handUpConf > 70) {
            prediction.textContent = 'Prediction: Hand Up (Stable)';
            prediction.style.color = '#ff3366';
        } else {
            prediction.textContent = 'Prediction: Uncertain (Label Flipping Risk)';
            prediction.style.color = '#ff9900';
            prediction.classList.remove('stable');
            prediction.classList.add('unstable');
        }
    }

    slider.addEventListener('input', updateConfidence);
    updateConfidence(); // 初始化 / Initialize
}

// ========================================
// Panel 4: Threshold Visualization - 阈值可视化
// ========================================

/**
 * 生成模拟感知数据
 * Generate simulated sensing data
 */
function generateDataStream() {
    const dataStream = document.getElementById('dataStream');
    if (!dataStream) return;
    
    const numPoints = 50;
    dataStream.innerHTML = '';
    
    for (let i = 0; i < numPoints; i++) {
        const point = document.createElement('div');
        point.className = 'data-point';
        
        // 生成带有趋势和噪声的数据 / Generate data with trend and noise
        const baseValue = 30 + Math.sin(i * 0.3) * 25;
        const noise = (Math.random() - 0.5) * 20;
        const value = Math.max(0, Math.min(100, baseValue + noise));
        
        point.style.height = value + '%';
        point.dataset.value = Math.round(value);
        
        dataStream.appendChild(point);
    }
    
    updateThresholdVisualization();
}

/**
 * 更新阈值可视化
 * Update threshold visualization
 */
function updateThresholdVisualization() {
    const thresholdSlider = document.getElementById('thresholdSlider');
    const thresholdValue = document.getElementById('thresholdValue');
    const dataPoints = document.querySelectorAll('.data-point');
    const aboveThresholdEl = document.getElementById('aboveThreshold');
    const eligibleEventsEl = document.getElementById('eligibleEvents');
    
    if (!thresholdSlider) return;
    
    const threshold = parseInt(thresholdSlider.value);
    thresholdValue.textContent = threshold;
    
    let aboveCount = 0;
    let eventCount = 0;
    let consecutiveAbove = 0;
    const minConsecutive = 3; // 最小连续样本数 / Minimum consecutive samples
    
    dataPoints.forEach((point, index) => {
        const value = parseInt(point.dataset.value);
        const isAbove = value >= threshold;
        
        // 更新视觉状态 / Update visual state
        point.classList.remove('above', 'below', 'event');
        
        if (isAbove) {
            point.classList.add('above');
            aboveCount++;
            consecutiveAbove++;
            
            // 标记事件起点 / Mark event start
            if (consecutiveAbove === minConsecutive) {
                eventCount++;
                // 标记这minConsecutive个点为事件 / Mark these points as event
                for (let i = 0; i < minConsecutive; i++) {
                    if (index - i >= 0) {
                        dataPoints[index - i].classList.add('event');
                    }
                }
            } else if (consecutiveAbove > minConsecutive) {
                point.classList.add('event');
            }
        } else {
            point.classList.add('below');
            consecutiveAbove = 0;
        }
    });
    
    // 更新统计 / Update statistics
    if (aboveThresholdEl) aboveThresholdEl.textContent = aboveCount;
    if (eligibleEventsEl) eligibleEventsEl.textContent = eventCount;
    
    // 更新可见性率 / Update visibility rate
    const visibilityRateEl = document.getElementById('visibilityRate');
    if (visibilityRateEl) {
        const rate = Math.round((aboveCount / dataPoints.length) * 100);
        visibilityRateEl.textContent = rate + '%';
        // 根据率值变色 / Color based on rate
        if (rate < 30) visibilityRateEl.style.color = '#ff3366';
        else if (rate < 60) visibilityRateEl.style.color = '#ff9900';
        else visibilityRateEl.style.color = '#00cc88';
    }
}

/**
 * 初始化阈值演示
 * Initialize threshold demo
 */
function initThresholdDemo() {
    const thresholdSlider = document.getElementById('thresholdSlider');
    
    generateDataStream();
    
    if (thresholdSlider) {
        thresholdSlider.addEventListener('input', updateThresholdVisualization);
    }

    // 初始化预设按钮 / Initialize preset buttons
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const threshold = this.dataset.threshold;
            if (thresholdSlider) {
                thresholdSlider.value = threshold;
                updateThresholdVisualization();
            }
            // 更新激活状态 / Update active state
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========================================
// Navigation - 导航
// ========================================

/**
 * 平滑滚动到指定面板
 * Smooth scroll to specified panel
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Scroll Progress Bar - 滚动进度条
// ========================================

/**
 * 初始化滚动进度条
 * Initialize scroll progress bar
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }, 10));
}

// ========================================
// Fixed Navigation - 固定导航栏
// ========================================

/**
 * 初始化固定导航栏
 * Initialize fixed navigation bar
 */
function initFixedNav() {
    const nav = document.getElementById('fixedNav');
    const navIndicator = document.getElementById('navIndicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const panels = document.querySelectorAll('.panel');
    const hero = document.querySelector('.hero');

    if (!nav || !hero) return;

    const heroHeight = hero.offsetHeight;

    window.addEventListener('scroll', debounce(() => {
        // 显示/隐藏导航栏 / Show/hide navigation
        if (window.scrollY > heroHeight - 100) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }

        // 更新当前面板指示 / Update current panel indicator
        let currentPanel = 1;
        panels.forEach((panel, index) => {
            const rect = panel.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                currentPanel = index + 1;
            }
        });

        // 更新导航链接激活状态 / Update nav link active state
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.panel == currentPanel) {
                link.classList.add('active');
            }
        });

        // 更新面板指示器 / Update panel indicator
        if (navIndicator) {
            navIndicator.textContent = `Panel ${currentPanel}/5`;
        }
    }, 50));
}

// ========================================
// Lightbox - 图片放大查看
// ========================================

/**
 * 初始化图片Lightbox
 * Initialize image lightbox
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const clickableImages = document.querySelectorAll('.clickable-img');

    if (!lightbox) return;

    // 点击图片打开lightbox / Click image to open lightbox
    clickableImages.forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.dataset.caption || this.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // 禁止背景滚动
        });
    });

    // 关闭lightbox / Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESC键关闭 / Close with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// ========================================
// Fade-in Animation - 淡入动画
// ========================================

/**
 * 初始化面板淡入动画
 * Initialize panel fade-in animation
 */
function initFadeInAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

// ========================================
// Taxonomy Complexity Meter - 分类复杂度指示器
// ========================================

/**
 * 初始化分类复杂度交互
 * Initialize taxonomy complexity interaction
 */
function initComplexityMeter() {
    const taxonomyBoxes = document.querySelectorAll('.taxonomy-box');
    const meterFill = document.getElementById('complexityMeter');
    const collapsedSection = document.querySelector('.collapsed-section');

    if (!meterFill) return;

    // 为每个分类框设置复杂度等级 / Set complexity level for each box
    const complexityLevels = [30, 40, 35, 50, 45]; // 不同维度的复杂度

    taxonomyBoxes.forEach((box, index) => {
        box.addEventListener('mouseenter', () => {
            meterFill.style.width = complexityLevels[index] + '%';
        });
    });

    // 悬停在collapsed区域时显示最高复杂度 / Show max complexity for collapsed section
    if (collapsedSection) {
        collapsedSection.addEventListener('mouseenter', () => {
            meterFill.style.width = '95%';
        });
    }

    // 鼠标离开时恢复默认 / Reset on mouse leave
    const taxonomyDiagram = document.querySelector('.taxonomy-diagram');
    if (taxonomyDiagram) {
        taxonomyDiagram.addEventListener('mouseleave', () => {
            meterFill.style.width = '20%';
        });
    }
}

// ========================================
// Image Carousel - 图片轮播
// ========================================

/**
 * 初始化图片轮播功能
 * Initialize image carousel with center zoom effect
 */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');

    if (!track || items.length === 0) return;

    let currentIndex = 0;
    const totalItems = items.length;

    // 更新轮播状态 / Update carousel state
    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'adjacent');
            
            if (index === currentIndex) {
                item.classList.add('active');
            } else if (index === currentIndex - 1 || index === currentIndex + 1) {
                item.classList.add('adjacent');
            }
        });

        // 更新指示器 / Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });

        // 计算位移量使当前项居中 / Calculate offset to center current item
        const trackWrapper = track.parentElement;
        const wrapperWidth = trackWrapper.offsetWidth;
        const activeItem = items[currentIndex];
        const activeWidth = 360; // active状态的宽度
        const adjacentWidth = 180; // 相邻状态的宽度
        const normalWidth = 160; // 普通状态的宽度
        const gap = 24; // gap: 1.5rem

        // 计算到当前项中心的偏移 / Calculate offset to current item center
        let offset = 0;
        for (let i = 0; i < currentIndex; i++) {
            if (i === currentIndex - 1) {
                offset += adjacentWidth;
            } else {
                offset += normalWidth;
            }
            offset += gap;
        }
        offset += activeWidth / 2;
        
        const centerOffset = wrapperWidth / 2;
        
        const translateX = centerOffset - offset;
        track.style.transform = `translateX(${translateX}px)`;
    }

    // 上一张 / Previous
    function goToPrev() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    // 下一张 / Next
    function goToNext() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    // 跳转到指定索引 / Go to specific index
    function goToIndex(index) {
        currentIndex = index;
        updateCarousel();
    }

    // 绑定按钮事件 / Bindbutton events
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);

    // 绑定指示器事件 / Bind indicator events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToIndex(index));
    });

    // 触屏滑动支持 / Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchStartX - touchEndX;
        
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
    }, { passive: true });

    // 键盘导航（当轮播在视口中）/ Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carousel = document.querySelector('.carousel-container');
        if (!carousel) return;
        
        const rect = carousel.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inView) {
            if (e.key === 'ArrowLeft') {
                goToPrev();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        }
    });

    // 初始化显示 / Initialize display
    updateCarousel();

    // 窗口调整时重新计算 / Recalculate on window resize
    window.addEventListener('resize', debounce(updateCarousel, 200));
}

// ========================================
// Back to Top - 回到顶部
// ========================================

/**
 * 初始化回到顶部按钮
 * Initialize back to top button
 */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Scroll Damping & Snap - 滚动阻尼与吸附
// ========================================

/**
 * 初始化滚动阻尼和回弹效果
 * Initialize scroll damping and bounce effect
 */
function initScrollDamping() {
    const sections = [document.querySelector('.hero'), ...document.querySelectorAll('.panel')];
    let isScrolling = false;
    let currentSection = 0;
    let touchStartY = 0;
    let lastScrollTime = 0;
    const scrollCooldown = 1000; // 滚动冷却时间增加到 1秒 / Increased to 1 second

    // 满足以下条件才触发吸附 / Only snap when conditions met
    function shouldSnap() {
        return !isScrolling && (Date.now() - lastScrollTime > scrollCooldown);
    }

    // 滚动到指定区域 / Scroll to specified section
    function scrollToSection(index, smooth = true) {
        if (index < 0 || index >= sections.length) return;
        if (isScrolling) return;

        isScrolling = true;
        currentSection = index;
        lastScrollTime = Date.now();

        const target = sections[index];
        if (target) {
            target.scrollIntoView({
                behavior: smooth ? 'smooth' : 'auto',
                block: 'start'
            });

            // 添加回弹动画类 / Add bounce animation class
            target.classList.add('snap-bounce');
            setTimeout(() => {
                target.classList.remove('snap-bounce');
            }, 400);
        }

        // 释放滚动锁 / Release scroll lock
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    }

    // 获取当前所在区域 / Get current section index
    function getCurrentSectionIndex() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        for (let i = 0; i < sections.length; i++) {
            const rect = sections[i].getBoundingClientRect();
            // 如果区域在视口中心附近 / If section is near viewport center
            if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.4) {
                return i;
            }
        }
        return currentSection;
    }

    // 检查是否滚动到当前页面底部/顶部 / Check if scrolled to bottom/top of current section
    function checkSectionBoundary(direction) {
        const currentIdx = getCurrentSectionIndex();
        const section = sections[currentIdx];
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        const threshold = 100; // 距离边缘的阈值 / Distance threshold from edge

        if (direction > 0) {
            // 向下滚动，检查是否接近页面底部 / Scrolling down, check if near bottom
            return rect.bottom <= window.innerHeight + threshold;
        } else {
            // 向上滚动，检查是否接近页面顶部 / Scrolling up, check if near top
            return rect.top >= -threshold;
        }
    }

    // 滚轮事件处理 / Mouse wheel event handler
    let wheelDelta = 0;
    const wheelThreshold = 150; // 提高滚动触发阈值 / Increased scroll trigger threshold

    window.addEventListener('wheel', (e) => {
        if (!shouldSnap()) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        
        // 只有在接近页面边缘时才累积滚动值 / Only accumulate when near section edge
        if (!checkSectionBoundary(direction)) {
            wheelDelta = 0;
            return;
        }

        wheelDelta += Math.abs(e.deltaY);

        // 积累滚动距离达到阈值时触发 / Trigger when accumulated scroll reaches threshold
        if (wheelDelta >= wheelThreshold) {
            const currentIdx = getCurrentSectionIndex();
            scrollToSection(currentIdx + direction);
            wheelDelta = 0;
        }

        // 清除积累值的定时器 / Timer to clear accumulated value
        clearTimeout(window.wheelTimer);
        window.wheelTimer = setTimeout(() => {
            wheelDelta = 0;
        }, 200);
    }, { passive: true });

    // 触屏事件处理 / Touch event handlers
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!shouldSnap()) return;

        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        const direction = deltaY > 0 ? 1 : -1;
        const swipeThreshold = 80; // 提高滑动触发阈值 / Increased swipe threshold

        // 只有在接近页面边缘时才触发 / Only trigger when near section edge
        if (Math.abs(deltaY) >= swipeThreshold && checkSectionBoundary(direction)) {
            const currentIdx = getCurrentSectionIndex();
            scrollToSection(currentIdx + direction);
        }
    }, { passive: true });

    // 键盘导航 / Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (!shouldSnap()) return;

        const currentIdx = getCurrentSectionIndex();

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            // 只有在接近页面底部时才触发 / Only trigger when near bottom
            if (checkSectionBoundary(1)) {
                e.preventDefault();
                scrollToSection(currentIdx + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            // 只有在接近页面顶部时才触发 / Only trigger when near top
            if (checkSectionBoundary(-1)) {
                e.preventDefault();
                scrollToSection(currentIdx - 1);
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            scrollToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            scrollToSection(sections.length - 1);
        }
    });

    // 初始化时定位到最近的section / Snap to nearest section on init
    setTimeout(() => {
        currentSection = getCurrentSectionIndex();
    }, 100);
}

// ========================================
// Initialization - 初始化
// ========================================

/**
 * 页面加载完成后初始化所有功能
 * Initialize all features when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Computational Inequality Storyboard Loaded');
    console.log('计算不平等故事板已加载');
    
    // 核心交互功能 / Core interactive features
    initConfidenceDemo();
    initThresholdDemo();
    initSmoothScroll();
    
    // 新增交互功能 / New interactive features
    initScrollProgress();
    initFixedNav();
    initLightbox();
    initFadeInAnimation();
    initComplexityMeter();
    initCarousel(); // 图片轮播
    initBackToTop();
    initScrollDamping(); // 滚动阻尼与吸附
});

// ========================================
// Utility Functions - 工具函数
// ========================================

/**
 * 防抖函数 - 限制函数执行频率
 * Debounce function - limit function execution frequency
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 检测元素是否在视口中
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
