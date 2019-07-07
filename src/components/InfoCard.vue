<template>
  <v-card>
    <v-toolbar
      color="#1c7ed6"
      dark
    >
      <v-toolbar-title>Files</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-list
      two-line
      subheader
    >
      <v-subheader inset>Folders</v-subheader>

      <v-list-tile
        v-for="item in items"
        :key="item.title"
        avatar
        @click=""
      >
        <v-list-tile-avatar>
          <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn
            icon
            ripple
          >
            <v-icon color="grey lighten-1">info</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <v-divider inset></v-divider>

      <v-subheader inset>Files</v-subheader>

      <v-list-tile
        v-for="item in items2"
        :key="item.title"
        avatar
      >
        <v-list-tile-avatar>
          <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "InfoCard",
  props: {
    filesList: {
      type: Array,
      default: []
    },
  },
  watch: {
    filesList: function (newVal, oldVal) {
      this.items = [];
      this.items2 = [];
      this.filesListInternal = newVal;

      for (let i = 0; i < this.filesListInternal['files'].length; i++) {
        this.items.push(
          {
            icon: 'folder',
            iconClass: 'grey light-white white--text',
            title: this.filesListInternal['files'][i]
          }
        )
      }
      for (let i = 0; i < this.filesListInternal['dirs'].length; i++) {
        this.items2.push(
          {
            icon: 'folder',
            iconClass: 'grey light-white white--text',
            title: this.filesListInternal['dirs'][i]
          }
        )
      }
      this.$forceUpdate();
    }
  },
  data () {
    return {
      filesListInternal: [],
      items: [],
      items2: []
    }
  }
}
</script>

<style>
</style>
