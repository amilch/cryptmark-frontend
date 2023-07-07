import { describe, it, expect } from 'vitest'

import { encryption } from "../encryption";
import { exportedForTesting } from "../encryption";

describe('utils/encryption', () => {
    it('canCombineCipherAndNonceInOneString', async () => {
        const packed = await exportedForTesting.packCipherNonce(
            new Uint8Array([13, 12]), new Uint8Array([1, 61]))

        expect(packed).equals('DQw:AT0')
    })

    it('canUnpackCipherAndNonceFromCombinedString', async () => {
        const {cipher, nonce} = await exportedForTesting.unpackCipherNonce('DQw:AT0')

        expect(cipher).toEqual(new Uint8Array([13, 12]))
        expect(nonce).toEqual(new Uint8Array([1, 61]))
    })

    it('canGenerateRootKey', async () => {
        const {masterKey, serverPassword, seed} = await encryption
            .computeRootKey('user', 'password')

        expect(masterKey).length(43)
        expect(serverPassword).length(43)
        expect(seed).length(43)
    })

    it('usesProvidedSeedWhileGeneratingRootKey', async () => {
        const {masterKey, serverPassword, seed} = await encryption
            .computeRootKey('user', 'password', 'DQw')

        expect(masterKey).equals("_uBZBRYsH8LtJ-b0L7l3LfCrpX4BLsKYJnziasZD5Po")
        expect(serverPassword).equals("JBzHfpSi3621pqswih3n2XBQboqLRZ2dZkFx27_TkNY")
        expect(seed).equals('DQw')
    })


    it('canEncryptAnItemWithKeyGeneratingNonces', async () => {
        let {encryptedItemKey, encryptedItem} =
            await encryption.encryptItem({secret: 'hidden'}, '_uBZBRYsH8LtJ-b0L7l3LfCrpX4BLsKYJnziasZD5Po')

        const encryptedItemKeyUnpacked = await exportedForTesting.unpackCipherNonce(encryptedItemKey)
        const encryptedItemUnpacked = await exportedForTesting.unpackCipherNonce(encryptedItem)

        expect(encryptedItemKeyUnpacked.cipher).length(48)
        expect(encryptedItemKeyUnpacked.nonce).length(12)
        expect(encryptedItemUnpacked.cipher).length(35)
        expect(encryptedItemUnpacked.nonce).length(12)
    })

    it('canDecryptItem', async () => {
        const res = await exportedForTesting.decryptItem({
            encryptedItemKey: 'BMZdDY-YN6nbBILxQeGw6FWwwUTLPCrUQCh8QEBtq3bzGJjoDDRm8VsvAHgqNqbW:ZqyvHWlwdzAhUuGI',
            encryptedItem: 'RqGQ0UPL1Y6g5_dbxMEPuSsNeaV6xahA_E5RSqkBanyfar4:LXJAGOSK-nPZxVNB'
        }, '_uBZBRYsH8LtJ-b0L7l3LfCrpX4BLsKYJnziasZD5Po')

        expect(res.secret).equals('hidden')
    })
})