<template>
    <h1 class='text-white text-2xl font-bold text-center p-4 tracking-widest'>
        Mars Rover Photo Query Builder
    </h1>
    <div class='border border-gray-300 rounded grid grid-cols-3 space-x-4 p-4'>
        <!-- Rovers Display Here -->
        <div v-for='rover in rovers' v-bind:key='rover.id' class=''>
            <rover-card :rover-data='rover' :is-active='hasActiveRover(rover.id)' @toggle-rover='toggleActiveRover($event), resetQueriedPhotos()'></rover-card>
        </div>
        <!-- Submit Query -->
        <div class="col-span-3 w-full flex items-inline items-center">
          <query-form></query-form>
        </div>
        <!-- Query Error -->
        <transition name='fade'>
          <error-card :error='axiosError'></error-card>
        </transition>
    </div>
    <!-- Cameras and photo numbers -->
    <!-- Only show if there are queried results -->
    <div v-if="queriedPhotos.photos" class="flex flex-wrap p-4 place-content-center space-x-1">
      <div class="text-white text-lg text-center w-full">Total Photos {{ queriedPhotos.photos.length }}</div>
      <div class="text-white">Filter by Camera:</div>
      <div>
        <button-camera v-for="camera in activeRover[0].cameras" v-bind:key="camera.id"
          @toggle-button-camera="toggleCameraFilter($event)"
          :camera-name="camera.name" :camera-id="camera.id"
          :is-active='hasActiveCamera(camera.name)' :number-of-photos='numberOfPhotos(camera.name)'
          class="m-1"
      ></button-camera>
      </div>
    </div>
    <!-- No Photos for that Date -->
    <transition name='fade'>
      <error-card :error='noPhotosError'></error-card>
    </transition>
    <!-- Query Results -->
    <div v-if="queriedPhotos.photos && activeCameraFilters.length > 0" class='border border-gray-300 rounded flex flex-wrap content-center p-2'>
      <div v-for='photo in queriedPhotos.photos' v-bind:key="photo.id">
        <card-rover-image v-if="activeCameraFilters.includes(photo.camera.full_name)" :rover="photo"></card-rover-image>
      </div>
    </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script>
import ButtonCamera from './components/ButtonCamera.vue'
import CardRoverImage from './components/CardRoverImage.vue'
import ErrorCard from './components/ErrorCard.vue'
import QueryForm from './components/QueryForm.vue'
import RoverCard from './components/RoverCard.vue'
import { provide, ref } from 'vue'
export default {
    name: 'App',
    components: {
        ButtonCamera,
        CardRoverImage,
        ErrorCard,
        QueryForm,
        RoverCard
    },
    setup() {
        const API_KEY = 'Yuqv0otgbUO7NKcuzglMmErCjCULIXPYcxOuW1Ka'
        const API_ADDRESS = 'https://api.nasa.gov/mars-photos/api/v1/rovers/'
        const buildQuery = () => {
          //curiosity/photos?earth_date=2015-6-3&api_key=Yuqv0otgbUO7NKcuzglMmErCjCULIXPYcxOuW1Ka
          // console.log(activeRover.value[0])
          return [API_ADDRESS, activeRover.value[0].name, '/photos?earth_date=', earthDate.value, '&api_key=', API_KEY].join('')
        }
        /**
         * Rovers data. I've hardcoded here, though could load from a json file,
         * or a db call, etc.
         * @type {Array}
         */
        const rovers = [{
                id: 1,
                name: 'Curiosity',
                img: 'curiosity1.jpg',
                cameras: [{
                        id: 1,
                        abbr: 'FHAZ',
                        name: 'Front Hazard Avoidance Camera'
                    },
                    {
                        id: 2,
                        abbr: 'RHAZ',
                        name: 'Rear Hazard Avoidance Camera'
                    },
                    {
                        id: 3,
                        abbr: 'MAST',
                        name: 'Mast Camera'
                    },
                    {
                        id: 4,
                        abbr: 'CHEMCAM',
                        name: 'Chemistry and Camera Complex'
                    },
                    {
                        id: 5,
                        abbr: 'MAHLI',
                        name: 'Mars Hand Lens Imager'
                    },
                    {
                        id: 6,
                        abbr: 'MARDI',
                        name: 'Mars Descent Imager'
                    },
                    {
                        id: 7,
                        abbr: 'NAVCAM',
                        name: 'Navigation Camera'
                    }
                ]
            },
            {
                id: 2,
                name: 'Opportunity',
                img: 'opportunity.jpeg',
                cameras: [{
                        id: 1,
                        abbr: 'FHAZ',
                        name: 'Front Hazard Avoidance Camera'
                    },
                    {
                        id: 2,
                        abbr: 'RHAZ',
                        name: 'Rear Hazard Avoidance Camera'
                    },
                    {
                        id: 3,
                        abbr: 'NAVCAM',
                        name: 'Navigation Camera'
                    },
                    {
                        id: 4,
                        abbr: 'PANCAM',
                        name: 'Panoramic Camera'
                    },
                    {
                        id: 5,
                        abbr: 'MINITES',
                        name: 'Spectrometer (Mini-TES)'
                    }
                ]
            },
            {
                id: 3,
                name: 'Spirit',
                img: 'spirit.jpeg',
                cameras: [{
                        id: 1,
                        abbr: 'FHAZ',
                        name: 'Front Hazard Avoidance Camera'
                    },
                    {
                        id: 2,
                        abbr: 'RHAZ',
                        name: 'Rear Hazard Avoidance Camera'
                    },
                    {
                        id: 3,
                        abbr: 'NAVCAM',
                        name: 'Navigation Camera'
                    },
                    {
                        id: 4,
                        abbr: 'PANCAM',
                        name: 'Panoramic Camera'
                    },
                    {
                        id: 5,
                        abbr: 'MINITES',
                        name: 'Spectrometer (Mini-TES)'
                    }
                ]
            }
        ]
        /**
         * an array of objects containing the id of active rovers
         * @type {Array}
         */
        const activeRover = ref([])
        provide('activeRover', activeRover)
        /**
         * Adds rover to selected rovers
         * Will pop out rover already present, or replace with new rover.
         * 
         * @param  {Object} rover Object of rover data, for now I just need ID but 
         *                        good to anticpate future data needs.
         * @return {[type]}       [description]
         */
        const toggleActiveRover = (event) => {
            //is the rover already toggled
            if (activeRover.value.map(f => f.id).includes(event.id)) {
                //then remove it
                return activeRover.value = activeRover.value.filter(f => f.id != event.id)
            //if rover hasn't been toggled yet
            } else if (!activeRover.value.map(f => f.id).includes(event.id)) {
                //add it (only one rover with this version)
                return activeRover.value = [{
                    id: event.id,
                    name: event.name,
                    cameras: event.cameras,
                }]
            }
        }
        /**
         * Fn to return boolean
         * @param  {Number} rover Rover ID
         * @return {Boolean}       
         */
        const hasActiveRover = (rover) => {
            return activeRover.value.map(f => f.id).includes(rover)
        }
        const isActiveRover = () => {
          return activeRover.value.length > 0
        }
        provide('isActiveRover', isActiveRover)
        /**
         * This Concats image folder and image to make image path.
         * Might be useful at some point to have, in case of path changes.
         * @param  {String} image string containing image name.
         * @return {String}       Returns full path to an image.
         */
        const returnFromImageFolder = (image) => {
            return './img/' + image
        }
        provide('returnFromImageFolder', returnFromImageFolder)

        const earthDate = ref('')
        provide('earthDate', earthDate)

        const queriedPhotos = ref({})
        const submitQuery = async () => {
          const axios = await import('axios');
          axios.get(buildQuery())
            .catch((error)=>{
              axiosError.value = nameError(error)
            })
            .then(response => {
              if(response.data.photos.length === 0){
                noPhotosError.value = 'Whoops! No Photos for that Date.'
              }
              //limit to first 25 here. 
              let limitedResponseData = {photos: response.data.photos.slice(0,25)}
              queriedPhotos.value = limitedResponseData

            })
        }
        provide('submitQuery', submitQuery)
        const resetQueriedPhotos = () => {
          return queriedPhotos.value = ''
        }
        const axiosError = ref('')
        const nameError = (error) => {
          if (error == 'Error: Request failed with status code 500') {
            return 'Error: Invalid Date!'
          }
        }
        const removeError = () => {
          noPhotosError.value = ''
          axiosError.value = ''
        }
        provide('removeError', removeError)
        const noPhotosError = ref('')
        /**
         * Array of camera filter IDs
         * @type {Array}
         */
        const cameraFilters = ref([])
        const activeCameraFilters = ref([])
        const toggleCameraFilter = (event) => {
          //if it has camera, remove it
          if (activeCameraFilters.value.includes(event.name)) {
            return activeCameraFilters.value = activeCameraFilters.value.filter( e => e !== event.name)
          } else if (!activeCameraFilters.value.includes(event.name)) {
            return activeCameraFilters.value.push(event.name)
          }
        }
        const hasActiveCamera = (camera) => {
            return activeCameraFilters.value.includes(camera)
        }
        const numberOfPhotos = (cameraName) => {
          // console.log(queriedPhotos.value)
          // console.log(queriedPhotos.value.photos.map(p => p.camera.full_name  ))
          return queriedPhotos.value.photos.filter(p => p.camera.full_name == cameraName ).length
        }

        return {
            activeCameraFilters,
            activeRover,
            axiosError,
            cameraFilters,
            earthDate,
            hasActiveCamera,
            hasActiveRover,
            isActiveRover,
            noPhotosError,
            numberOfPhotos,
            queriedPhotos,
            // returnQueriedPhotos,
            removeError,
            resetQueriedPhotos,
            rovers,
            submitQuery,
            toggleActiveRover,
            toggleCameraFilter
        }
    }
}
</script>