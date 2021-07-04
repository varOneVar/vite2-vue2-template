<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'Link',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  render(h) {
    if (isExternal(this.to)) {
      return h(
        'a',
        {
          attrs: {
            target: '_blank',
            rel: 'noopener',
            href: this.to
          }
        },
        this.$slots.default
      )
    }
    return h(
      'router-link',
      {
        props: {
          to: this.to
        }
      },
      this.$slots.default
    )
  }
}
</script>
