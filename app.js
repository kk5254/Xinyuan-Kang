/**
 * Computational Inequality Storyboard - Interactive Scripts
 * 计算不平等故事板 - 交互脚本
 * 
 * 功能说明 / Features:
 * - Panel 3: Hand position confidence simulation (手势位置置信度模拟)
 * - Panel 4: Threshold governance visualization (阈值治理可视化)
 * - Smooth scrolling navigation (平滑滚动导航)
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
// Initialization - 初始化
// ========================================

/**
 * 页面加载完成后初始化所有功能
 * Initialize all features when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Computational Inequality Storyboard Loaded');
    console.log('计算不平等故事板已加载');
    
    initConfidenceDemo();
    initThresholdDemo();
    initSmoothScroll();
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
