import { EntityHurtAfterEvent, Player } from "@minecraft/server";
import { MinecraftEntityTypes } from "@minecraft/vanilla-data";
import { InGameEntityHurt } from "@mc-werewolf/game-engine";
import { WEREWOLF_ADDITIONALROLES_ONE_TRANSLATE_IDS } from "../constants/translate";

InGameEntityHurt.afterEvent<EntityHurtAfterEvent>((ev, ctx) => {
    const { damage, damageSource, hurtEntity } = ev;

    const hurtEntityData = ctx.werewolfGameData.playersData.find(
        (playerData) => playerData.player.id === hurtEntity.id,
    );
    if (!hurtEntityData) return;
    if (hurtEntityData.role === null) return;

    if (!damageSource.damagingEntity) return;
    if (damageSource.damagingEntity.typeId !== MinecraftEntityTypes.Player) return;

    const hitPlayer = damageSource.damagingEntity as Player;
    if (hurtEntityData.role.id === "nekomata") {
        if (hurtEntity.id === hitPlayer.id) return;
        if (Math.random() < 0.5) {
            hitPlayer.applyDamage(999);
            hitPlayer.sendMessage({
                translate:
                    WEREWOLF_ADDITIONALROLES_ONE_TRANSLATE_IDS.NEKOMATA_SKILL_DRAGDOWN_MESSAGE,
                with: [hurtEntity.nameTag],
            });
        }
    }
});
