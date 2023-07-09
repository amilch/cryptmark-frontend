import {describe, it, expect, beforeEach} from 'vitest'

import {mount, shallowMount} from '@vue/test-utils'
import Bookmark from '../Bookmark.vue'
import {createVuetify} from "vuetify";

describe('Bookmark', () => {
  const vuetify = createVuetify()

  it('displaysUrlAsTitleIfNoTitle', () => {
    const wrapper = mount(Bookmark, {
      props: {
        bookmark: {
          title: '',
          url: 'https://google.com'
        }
      },
      globals: {
        plugins: [vuetify]
      }
    })
    console.log(wrapper.element.innerHTML)
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
