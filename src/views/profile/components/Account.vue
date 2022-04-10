<template>
  <el-form>
    <el-form-item :label="$t('profiles.nickname')">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item :label="$t('profiles.email')">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item :label="$t('profiles.phone')">
      <el-input v-model.trim="user.phone" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('profiles.update') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          phone: '',
          oldPassword: '',
          newPassword: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
