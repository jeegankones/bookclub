<template>
    <div class="flex items-center justify-center overflow-hidden">
        <svg
            ref="selectorSvg"
            class="absolute z-10 overflow-visible"
            :width="selectorDiameter"
            :height="selectorDiameter"
        ></svg>
        <svg
            ref="chartSvg"
            :width="diameter"
            :height="diameter"
        ></svg>
    </div>
</template>

<script setup>
import * as d3 from 'd3';
import seedrandom from 'seedrandom';
import { computed, onMounted, ref, watch } from 'vue';

import { useModal } from '../stores/useModal';

const chartSvg = ref(null);
const selectorSvg = ref(null);

onMounted(() => {
    if (useModal.afterEnter) {
        renderChart();
        renderSelector();
        spinWheel();
    }
});

// Watchers
watch(
    () => useModal.afterEnter,
    (value) => {
        if (value) {
            renderChart();
            renderSelector();
            spinWheel();
        }
    },
);

// Props
const props = defineProps({
    bookData: { type: Array, required: true },
    winningBook: { type: Object, required: true },
});

// Data
const diameter = 500;
const selectorDiameter = 60;
const textWidth = diameter / 2 - 100;

// Computed
const pieData = computed(() => {
    const pie = d3.pie().value((d) => d.voteCount);
    return pie(props.bookData.filter((book) => book.voteCount > 0));
});

// Emits
const emit = defineEmits(['close']);

function spinWheel() {
    const fullCircle = 360;
    const rotations = 15;
    const initialDelay = 2000;
    const duration = 16000;
    const closeDelay = duration + 3000;
    const winningSlice = pieData.value.find((slice) => slice.data.id === props.winningBook.id);
    const seededRandom = seedrandom(props.winningBook.id);
    const randomAngle =
        seededRandom() * (winningSlice.endAngle - winningSlice.startAngle) +
        winningSlice.startAngle;
    const finalAngle = 90 - (randomAngle * 180) / Math.PI;
    const interpolateRotation = d3.interpolateString(
        'transform-origin:center;transform:rotate(0deg)',
        `transform-origin:center;transform:rotate(${fullCircle * rotations + finalAngle}deg)`,
    );

    setTimeout(() => {
        d3.select(chartSvg.value)
            .transition()
            .duration(duration)
            .ease(d3.easeCubicOut)
            .attrTween('style', () => interpolateRotation);
        setTimeout(() => {
            emit('close');
        }, closeDelay);
    }, initialDelay);
}

function renderSelector() {
    const svg = d3
        .select(selectorSvg.value)
        .attr('stroke', 'white')
        .attr('viewBox', [
            -selectorDiameter / 2,
            -selectorDiameter / 2,
            selectorDiameter,
            selectorDiameter,
        ])
        .attr('style', 'max-width: 100%; height: auto;');

    svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', selectorDiameter / 2)
        .attr('fill', 'white');

    svg.append('path')
        .attr(
            'd',
            d3
                .symbol()
                .type(d3.symbolTriangle)
                .size(selectorDiameter * 20),
        )
        .attr('transform', 'translate(12,0) rotate(90)')
        .style('fill', 'white');
}

function wrapText(text) {
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.1;

    let tspan = text.text(null).append('tspan').attr('x', 0).attr('dy', 0);

    while (words.length) {
        word = words.pop();
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > textWidth) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', 0).attr('dy', `${lineHeight}em`);
            tspan.text(line.join(' '));
            lineNumber++;
        }
    }
    text.attr('y', `-${(lineHeight * lineNumber) / 2}em`);
}

function shrinkText() {
    const text = d3.select(this);
    let width = text.node().getComputedTextLength();
    let fontSizeEm = 2;
    while (width > textWidth) {
        if (fontSizeEm <= 1) {
            wrapText(text);
            return;
        }
        fontSizeEm -= 0.05;
        text.style('font-size', `${fontSizeEm}em`);
        width = text.node().getComputedTextLength();
    }
}

function renderChart() {
    const textRotation = (d) => {
        return ((d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180) / Math.PI;
    };

    const color = d3.scaleOrdinal().range(d3.schemeSet2);

    const arc = d3
        .arc()
        .innerRadius(selectorDiameter / 2)
        .outerRadius(diameter / 2 - 10);

    const svg = d3
        .select(chartSvg.value)
        .attr('viewBox', [-diameter / 2, -diameter / 2, diameter, diameter])
        .attr('style', 'max-width: 100%; height: auto;');

    svg.append('g')
        .attr('stroke', 'white')
        .attr('stroke-width', '2px')
        .selectAll()
        .data(pieData.value)
        .join('path')
        .attr('d', arc)
        .attr('fill', (d) => {
            return color(d.data.id);
        });

    svg.append('g')
        .selectAll()
        .data(pieData.value)
        .join('text')
        .text((d) => d.data.title)
        .style('font-weight', 'bold')
        .style('font-size', '2em')
        .style('fill', '#272935')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr(
            'transform',
            (d) => `translate(${arc.centroid(d)}) rotate(90) rotate(${textRotation(d)})`,
        );

    svg.selectAll('text').each(shrinkText);
}
</script>
