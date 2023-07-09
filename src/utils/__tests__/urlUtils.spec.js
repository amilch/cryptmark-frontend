import { describe, it, expect } from 'vitest'
import { urlUtils } from "@/utils/urlUtils";

describe('getWholeURL', () => {
    it('returnsFullPathForFullPathInput', () => {
        expect(urlUtils.getWholeURL('https://google.com/')).equals('https://google.com/')
    })
    it('appendsHttpsToUrl', () => {
        expect(urlUtils.getWholeURL('www.google.com')).equals('https://www.google.com/')
    })
    it('HttpProcol', () => {
        expect(urlUtils.getWholeURL('www.google.com')).equals('https://www.google.com/')
    })
    it('urlWithQueryStringIsSavedWithoutModification', () => {
        expect(urlUtils.getWholeURL('https://www.google.com/?q=hallo+welt')).equals('https://www.google.com/?q=hallo+welt')
    })
    it('noValidUrlReturnsNull', () => {
        expect(urlUtils.getWholeURL('hallo welt')).null
    })
})

describe('isURL', () => {
    it('validUrlReturnsFalse', () => {
        expect(urlUtils.isURL('www.google.com')).true
    })
    it('noValidUrlReturnsFalse', () => {
        expect(urlUtils.isURL('hallo welt')).false
    })

})
