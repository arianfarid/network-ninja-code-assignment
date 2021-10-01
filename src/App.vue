<template>
    <h1 class='text-white text-2xl font-bold text-center p-4 tracking-widest'>
        Mars Rover Photo Query Builder
    </h1>
    <div class='border border-gray-300 rounded grid grid-cols-3 space-x-2 p-2'>
        <!-- Rovers Display Here -->
        <div v-for='rover in rovers' v-bind:key='rover.id' class=''>
            <rover-card :rover-data='rover' :is-active='hasActiveRover(rover.id)' @toggle-rover='toggleActiveRover($event)'></rover-card>
        </div>
        <!-- Query Date -->
        <div class='col-start-2 place-self-center m-4'>
          <!-- min/max dates to help narrow, should be related to rover data -->
          <input v-if='isActiveRover()' v-model='earthDate' v-on:input='checkValidDate(earthDate)'
          class='p-4 rounded' type='date'>
        </div>
        <div class='col-start-3 place-self-center m-4'>
          <!-- min/max dates to help narrow, should be related to rover data -->
          <button v-if='isActiveRover()' v-on:click='submitQuery()'
          class='bg-none text-white p-4 border border-gray-300
          hover:border-white hover:border-2 hover:border-white hover:shadow-glow-md
          active:border-green-300 rounded'>Submit Query</button>
        </div>
        <!-- Query Error -->
        <transition name='fade'>
          <div v-if='axiosError'
          class='text-red-500 top-0 left-0 w-auto bg-red-50 absolute
          p-1 rounded border border-red-500 text-center
          transition ease-in-out duration-200 flex flex-inline'>
            {{ axiosError }}
            <button v-on:click="removeError()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path class="absolute right-0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </transition>
    </div>
    <!-- Cameras and photo numbers -->
    <!-- Only show if there are queried results -->
    <div v-if="queriedPhotos.length > 0" class="flex flex-wrap p-4 place-content-center space-x-1">
      <button v-for="camera in activeRover[0].cameras" v-bind:key="camera.id"
    class="bg-none p-1 border border-gray-300
          text-white text-xs text-center
          hover:border-white hover:border-2 hover:border-white hover:shadow-glow-md
          active:border-green-300 rounded">
        {{ camera.name }}
      </button>
    </div>
    <!-- Query Results -->
    <div v-if="queriedPhotos.length > 0" class='border border-gray-300 rounded grid grid-cols-3 space-x-1 p-2'>
      <div v-for='photo in queriedPhotos' v-bind:key="photo.id">
        <img :src='photo.img_src'>
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
import RoverCard from './components/RoverCard.vue'
import { provide, ref } from 'vue'
export default {
    name: 'App',
    components: {
        RoverCard
    },
    setup() {
        const API_KEY = 'Yuqv0otgbUO7NKcuzglMmErCjCULIXPYcxOuW1Ka'
        const API_ADDRESS = 'https://api.nasa.gov/mars-photos/api/v1/rovers/'
        const buildQuery = () => {
          //curiosity/photos?earth_date=2015-6-3&api_key=Yuqv0otgbUO7NKcuzglMmErCjCULIXPYcxOuW1Ka
          console.log(activeRover.value[0])
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
                img: 'curiosity.jpeg',
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
        const checkValidDate = (date) => {
          // let rawDate = new Date
          // let offset = theDate.getTimezoneOffset()
          console.log(date)
          // if (date)
        }

        const queriedPhotos = ref([])
        // const returnQueriedPhotos = () => {
        //   // Has a rover been selected? This should even need to display.
        //   if(typeof activeRover.value[0] === 'undefined') {
        //     return 'No Rover Selected'
        //   }
        //   // If there are no photos for that date
        //   if (queriedPhotos.value.length === 0 && earthDate.value > 0) {
        //     return ['No Photos exist for ', activeRover.value[0].name].join('')
        //   }

        // }
        /*
        Submits query, then writes query.
         */
        const submitQuery = async () => {
          const axios = await import('axios');
          axios.get(buildQuery())
            .catch((error)=>{
              console.log(error)
              axiosError.value = nameError(error)
            })
            .then(response => {
              console.log(response)
              queriedPhotos.value = response.data.photos
            })
        }
        const axiosError = ref('')
        const nameError = (error) => {
          if (error == 'Error: Request failed with status code 500') {
            return 'Error: Invalid Date!'
          }
        }
        const removeError = () => {
          return axiosError.value = ''
        }
        /**
         * Array of camera filter IDs
         * @type {Array}
         */
        const cameraFilters = ref([])
        const toggleCamera = (camera) => {
          if (cameraFilters.value.map(f => f.id).includes(event.id)) {
                //then remove it
                return cameraFilters.value = cameraFilters.value.filter(f => f.id != event.id)
            //if rover hasn't been toggled yet
            } else if (!cameraFilters.value.map(f => f.id).includes(event.id)) {
                //add it (only one rover with this version)
                return cameraFilters.value = [{
                    id: event.id,
                    name: event.name,
                    cameras: event.cameras,
                }]
            }
        }
        return {
            activeRover,
            axiosError,
            cameraFilters,
            checkValidDate,
            earthDate,
            hasActiveRover,
            isActiveRover,
            queriedPhotos,
            // returnQueriedPhotos,
            removeError,
            rovers,
            submitQuery,
            toggleActiveRover
        }
    }
}
</script>