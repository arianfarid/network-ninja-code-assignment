<template>
	<div class="border border-gray-300 rounded p-1 m-1">
		<div class="text-white font-thin text-center">
			{{ rover.camera.name }} ID: {{rover.id}}
		</div>
		<img :src='rover.img_src' class="w-36">
	</div>
</template>
<script>
export default {
	props: {
		rover: Object,
	}
}
</script>