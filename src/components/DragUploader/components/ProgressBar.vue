<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<
{
    percent:number
}>(),{
    percent:0
})

</script>

<template>
    <div class="progress-container shadow-md  w-full h-2 border rounded-full relative overflow-hidden">
        <div class="progress-inner transition-all w-full h-[1000%] absolute"></div>
        <div class="progress-outer transition-all rounded-full w-full h-full absolute z-10  flex items-center justify-end bg-slate-600 -left-[100%]" :style="{left:`-${100-props.percent}%`}">
        </div>
    </div>
</template>


<style >

.progress-inner{
    --strip-gap:5px;
    background-image: repeating-linear-gradient(-45deg,rgb(191, 191, 191),rgb(191, 191, 191) calc(var(--strip-gap)), transparent calc(var(--strip-gap)),transparent calc(2*var(--strip-gap)));
    animation: scrolling 1s infinite linear forwards;
}

@keyframes scrolling{
    0%{
        transform: translateY(0);
    }
    100%{
        transform: translateY(calc(-100% + .5rem)); /*加上 progress-container 的高度  */
    }
}
</style>
