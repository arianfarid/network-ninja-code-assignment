<template>
    <div v-if='error' class='text-red-500 top-0 left-0 w-auto bg-red-50 absolute
          p-1 rounded border border-red-500 text-center
          transition ease-in-out duration-200 flex flex-inline'>
        {{ error }}
        <button v-on:click="removeError(error)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path class="absolute right-0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    </div>
</template>
<script>
import { inject } from 'vue'
export default {
    props: {
        error: String,
    },
    setup() {
        const removeError = inject('removeError')
        return {
            removeError
        }
    }
}
</script>