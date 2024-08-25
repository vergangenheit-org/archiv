<template>
  <button
    @click="isOpen = true"
    v-bind="$attrs"
    class="flex items-center space-x-2 border border-gray-500/25 text-gray-400 text-xs shadow-sm px-3 py-1.5 hover:border-gray-500/50 focus:outline-none focus:border-gray-300 rounded-lg"
  >
    <svg
      class="-ml-1 flex-none w-3 h-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      ></path>
    </svg>
    <span class="flex-1 text-left">Suchen...</span>
    <span class="flex-none font-semibold">{{ shortcut }}</span>
  </button>

  <TransitionRoot :show="isOpen" as="template">
    <Dialog
      class="fixed inset-0 z-50 flex justify-center items-start"
      :open="isOpen"
      @keydown="navigateResults"
      @close="isOpen = false"
    >
      <TransitionChild
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
        as="template"
      >
        <DialogOverlay
          class="fixed inset-0 bg-main opacity-70 blur-lg"
        ></DialogOverlay>
      </TransitionChild>
      <TransitionChild
        enter="duration-200 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        as="template"
      >
        <div
          class="flex flex-col overflow-hidden w-full max-w-2xl bg-main rounded-lg mx-4 max-h-[80vh] mt-[10vh] relative"
        >
          <form
            class="flex items-center text-gray-400 relative"
            action="#"
            @submit.prevent="onSubmit"
          >
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                ></path>
              </svg>
            </div>
            <input
              @input="(e) => process(e.target.value)"
              class="w-full py-4 pl-12 border-b border-gray-400 outline-none placeholder-gray-400 bg-main"
              type="text"
              placeholder="Suchen..."
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                @click="isOpen = false"
                class="flex items-center p-1.5 uppercase font-semibold tracking-wider rounded-md border border-gray-400 focus:outline-none focus:border-gray-300 text-[0.65rem] leading-[1.1rem]"
                type="button"
              >
                Esc
              </button>
            </div>
          </form>

          <div class="overflow-auto">
            <ul v-if="results.length > 0" class="divide-y divide-gray-500/50">
              <li
                v-for="(item, index) in results"
                :key="index"
                :class="selectedIdx === index ? 'bg-gray-500/15' : ''"
                :ref="
                  (el) => {
                    resultsRefs[index] = el
                  }
                "
                @mousemove="selectedIdx = index"
                class="px-4 py-2.5"
              >
                <a :href="`/artikel/${item.document.slug}`">
                  <div class="font-semibold">
                    {{ item.document.data.title }}
                  </div>
                  <div class="text-xs mt-1">
                    {{ item.document.data.description }}
                  </div>
                </a>
              </li>
            </ul>

            <p
              v-if="results.length === 0"
              class="p-10 text-lg text-center text-main"
            >
              Keine Artikel gefunden.
            </p>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue"
import {
  Dialog,
  DialogOverlay,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue"
import { create, load, search } from "@orama/orama"
import { navigate } from "astro:transitions/client"

export default {
  components: { Dialog, DialogOverlay, TransitionRoot, TransitionChild },

  async setup() {
    const isApple = () => {
      const platform =
        navigator?.userAgentData?.platform || navigator?.platform || "unknown"
      return /(Mac|iPhone|iPad|iPod)/i.test(platform)
    }

    onMounted(() => {
      window.addEventListener("keydown", onKeyDown)
      process()
    })
    onUnmounted(() => window.removeEventListener("keydown", onKeyDown))

    let db
    const isOpen = ref(false)
    const shortcut = isApple() ? "⌘K" : "Ctrl+K"
    const results = ref([])
    const resultsRefs = ref([])
    const selectedIdx = ref(0)

    const debounce = (callback, wait) => {
      let timeoutId = null
      return (...args) => {
        window.clearTimeout(timeoutId)
        timeoutId = window.setTimeout(() => {
          callback(...args)
        }, wait)
      }
    }

    function onKeyDown(evt) {
      if (isOpen.value) return

      if ((evt.metaKey || evt.ctrlKey) && evt.key === "k") {
        isOpen.value = true
      }
    }

    async function getDb() {
      const db = await create({
        schema: {
          _: "string",
        },
      })
      const resp = await fetch(`/search.json`)
      const data = await resp.json()
      await load(db, data)
      return db
    }

    function navigateResults(evt) {
      if (["ArrowUp", "ArrowDown"].includes(evt.code)) {
        evt.preventDefault()

        if (evt.code === "ArrowDown") {
          if (selectedIdx.value === results.value.length - 1) {
            selectedIdx.value = 0
          } else {
            selectedIdx.value += 1
          }
        } else if (evt.code === "ArrowUp") {
          if (selectedIdx.value === 0) {
            selectedIdx.value = results.value.length - 1
          } else {
            selectedIdx.value -= 1
          }
        }

        resultsRefs.value[selectedIdx.value]?.scrollIntoView(false)
      }
    }

    function onSubmit() {
      const location =
        resultsRefs.value[selectedIdx.value]?.querySelector("a").href
      if (location) navigate(location)
    }

    const process = debounce(async (term) => {
      if (db === undefined) db = await getDb()
      const { hits } = await search(db, { term })
      results.value = hits
      await nextTick()
      resultsRefs.value = []
    }, 250)

    return {
      isOpen,
      results,
      process,
      shortcut,
      resultsRefs,
      selectedIdx,
      navigateResults,
      onSubmit,
    }
  },
}
</script>
