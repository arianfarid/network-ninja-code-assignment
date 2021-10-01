<template>
    <!-- Query Date -->
    <div class='col-start-2 place-self-center m-2'>
        <!-- min/max dates to help narrow, should be related to rover data -->
        <input v-if='isActiveRover()' v-model='earthDate' class='p-1 rounded' type='date'>
    </div>
    <div class='col-start-3 place-self-center m-2'>
        <!-- min/max dates to help narrow, should be related to rover data -->
        <button v-if='isActiveRover()' v-on:click='removeError(), submitQuery()' class='bg-none text-white p-1 border border-gray-300
            hover:border-white hover:border-2 hover:border-white hover:shadow-glow-md
            active:border-green-300 rounded'>Submit Query</button>
    </div>
</template>
<script>
import { inject } from 'vue'
export default {
    setup() {
        const isActiveRover = inject('isActiveRover')
        const earthDate = inject('earthDate')
        const submitQuery = inject('submitQuery')
        const removeError = inject('removeError')
        return {
            isActiveRover,
            earthDate,
            removeError,
            submitQuery
        }
    }
}
</script>