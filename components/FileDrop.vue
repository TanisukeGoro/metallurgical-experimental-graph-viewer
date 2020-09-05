<template>
  <div :class="{ boader: dragover }">
    <input
      id="fileUpload"
      ref="upload"
      type="file"
      accept="text/xml"
      style="display:none"
    />

    <slot></slot>
    <!-- <v-row justify="center">
      <v-icon v-if="!dragover" color="indigo darken-2" size="75"
        >mdi-cloud-upload-outline</v-icon
      >
      <v-icon v-if="dragover" color="indigo darken-2" size="75"
        >mdi-book-plus</v-icon
      >
    </v-row> -->
    <!-- <v-row justify="center">
      <span class="title indigo--text text--darken-2">{{ title }}</span>
    </v-row> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'nuxt-property-decorator'

@Component
export default class FileDrop extends Vue {
  @Prop({ default: '' })
  title!: string

  // internal properties
  formUpload: boolean = false
  dragover: boolean = false

  mounted() {
    // to register listeners, we have to know the
    // html elements
    const dropzone = this.$el
    const fileupload = this.$el.firstElementChild as HTMLElement
    // register listeners on your dropzone / v-sheet
    if (dropzone) {
      // register all drag & drop event listeners
      dropzone.addEventListener('dragenter', (e) => {
        e.preventDefault()
        this.dragover = true
      })
      dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault()
        this.dragover = false
      })
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault()
        this.dragover = true
      })
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault()
        const dragevent = e as DragEvent
        if (dragevent.dataTransfer) {
          this.filesSelected(dragevent.dataTransfer.files)
        }
      })
      // register event listener for keyboard usage
      dropzone.addEventListener('click', (e) => {
        e.preventDefault()
        if (fileupload) {
          fileupload.click()
        }
      })
      dropzone.addEventListener('keypress', (e) => {
        e.preventDefault()
        const keyEvent = e as KeyboardEvent
        if (keyEvent.key === 'Enter') {
          if (fileupload) fileupload.click()
        }
      })
      // register listeners on the file input
      if (fileupload) {
        fileupload.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement
          if (target.files) {
            this.filesSelected(target.files)
          }
        })
      }
    }
  }

  /**
   * upload event...
   */
  @Emit()
  filesSelected(fileList: FileList) {
    this.dragover = false
  }
}
</script>

<style scoped>
.boader {
  border: solid 1px rgb(34, 192, 255);
}
</style>
