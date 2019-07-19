<template>
  <div id="app">
    <Layout>
      <Sider hide-trigger :style="{background: '#fff'}">
        <Menu :active-name="name" theme="light" width="auto" @on-select="route" accordion>
          <MenuItem name="home" to>Home</MenuItem>
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-paper" />Three
            </template>
            <MenuItem name="cloth">Three-cloth</MenuItem>
            <MenuItem name="shader">Three-shader</MenuItem>
            <MenuItem name="threedworld">Three-dworld</MenuItem>
            <MenuItem name="snow">Three-snow</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout :style="{padding: '24px'}">
        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
          <router-view />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "app",
  computed: {
    name() {
      return this.$route.name;
    }
  },
  methods: {
    // 页面跳转
    route(name) {
      name && this.$router.push(name);
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  .ivu-layout {
    min-height: 100%;
    .ivu-layout-content {
      min-height: 100%;
    }
  }
}
</style>
