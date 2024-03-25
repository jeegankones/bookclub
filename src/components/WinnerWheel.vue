<template>
    <div class="relative mx-auto inline-flex items-center justify-center overflow-hidden">
        <svg
            ref="selectorSvg"
            class="absolute z-10 overflow-visible"
            width="10%"
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
import { storeToRefs } from 'pinia';
import seedrandom from 'seedrandom';
import { computed, nextTick, ref, watch } from 'vue';
import { useModalStore } from '../stores/useModalStore';

const modalStore = useModalStore();
const { afterEnter } = storeToRefs(modalStore);

const chartSvg = ref(null);
const selectorSvg = ref(null);

watch(
    afterEnter,
    async (value) => {
        if (value) {
            await nextTick();
            renderChart();
            renderSelector();
            spinWheel();
        }
    },
    { immediate: true },
);

const props = defineProps({
    bookList: { type: Array, required: true },
    winningBook: { type: Object, required: true },
    votesByBookId: { type: Object, required: true },
});

const diameter = 800;
const selectorDiameter = diameter / 10;
const textWidth = diameter / 2 - 100;

const pieData = computed(() => {
    const pie = d3.pie().value((d) => props.votesByBookId[d.id]);
    return pie(props.bookList.filter((book) => props.votesByBookId[book.id]));
});

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
                .size(selectorDiameter * 28),
        )
        .attr('transform', `translate(${selectorDiameter / 2},0) rotate(90)`)
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
        if (fontSizeEm <= 1.5) {
            wrapText(text);
            return;
        }
        fontSizeEm -= 0.05;
        text.style('font-size', `${fontSizeEm}em`);
        width = text.node().getComputedTextLength();
    }
}

function renderChart() {
    function textRotation(d) {
        return ((d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180) / Math.PI;
    }

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
