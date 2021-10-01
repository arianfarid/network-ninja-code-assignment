<template>
    <div class='border border-gray-300 rounded w-auto cursor-pointer
    hover:border-2 hover:border-white hover:shadow-glow-md
    transition ease-in-out duration-200' :class='{"border-green-500": isActive, "hover:border-green-300": isActive}' v-on:click="emitToggleRover()">
        <!-- Title -->
        <h3 class='text-white text-center text-lg font-thin
        transition ease-in-out duration-200'>{{roverData.name}}</h3>
        <!-- Image -->
        <div class='m-2' style="background-image: ">
            <img :src='returnFromImageFolder(roverData.img)'>
        </div>
    </div>
</template>
<script>
import { inject } from 'vue'
export default {
    props: {
        isActive: Boolean,
        roverData: Object
    },
    setup(props, context) {
        const returnFromImageFolder = inject('returnFromImageFolder')
        const emitToggleRover = () => {
            context.emit("toggleRover", {
                "id": props.roverData.id,
                "name": props.roverData.name,
                "cameras": props.roverData.cameras
            })
        }
        return {
            emitToggleRover,
            returnFromImageFolder
        }
    }
}
</script>