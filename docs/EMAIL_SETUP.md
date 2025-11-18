# Configuration de l'envoi d'emails avec Resend

Ce guide explique comment configurer l'envoi d'emails pour les codes OTP avec Resend.

## Étapes de configuration

### 1. Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit
3. Vérifiez votre email

### 2. Obtenir votre clé API

1. Connectez-vous à votre dashboard Resend
2. Allez dans **API Keys**
3. Cliquez sur **Create API Key**
4. Donnez-lui un nom (ex: "Restaurant SABORES DE PORTUGAL OTP")
5. Copiez la clé (vous ne pourrez la voir qu'une seule fois !)

### 3. Configurer le domaine d'envoi

#### Option A : Utiliser le domaine de test (pour le développement)

Resend fournit un domaine de test gratuit : `onboarding@resend.dev`

- ✅ Pas de configuration nécessaire
- ✅ Parfait pour le développement
- ❌ Limité à votre email uniquement
- ❌ Les emails peuvent aller dans les spams

#### Option B : Configurer votre propre domaine (pour la production)

1. Dans le dashboard Resend, allez dans **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `sumbo.fr`)
4. Suivez les instructions pour ajouter les enregistrements DNS :
   - Enregistrement SPF
   - Enregistrement DKIM
   - Enregistrement DMARC (optionnel mais recommandé)

**Exemple d'enregistrements DNS:**
```
Type: TXT
Host: @
Value: v=spf1 include:resend.com ~all

Type: CNAME
Host: resend._domainkey
Value: resend._domainkey.resend.com

Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@sumbo.fr
```

5. Attendez la vérification (peut prendre jusqu'à 48h)
6. Une fois vérifié, vous pouvez envoyer des emails depuis `noreply@sumbo.fr`

### 4. Configurer les variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Important :** Ne committez JAMAIS votre clé API dans git !

### 5. Tester l'envoi d'emails

#### En développement (avec domaine de test)

Si vous utilisez le domaine de test, modifiez temporairement `/lib/email.ts` :

```typescript
from: 'Restaurant SABORES DE PORTUGAL <onboarding@resend.dev>',
```

Puis testez en créant une réservation. L'email sera envoyé uniquement à l'adresse email enregistrée sur Resend.

#### En production (avec votre domaine)

Une fois votre domaine vérifié, gardez la configuration actuelle :

```typescript
from: 'Restaurant SABORES DE PORTUGAL <noreply@sumbo.fr>',
```

## Limites et tarifs

### Plan gratuit de Resend :
- ✅ 100 emails/jour
- ✅ 1 domaine personnalisé
- ✅ API complète
- ✅ Parfait pour commencer

### Plan payant (Pro) :
- 50,000 emails/mois pour $20/mois
- Domaines illimités
- Support prioritaire

## Dépannage

### L'email n'arrive pas

1. **Vérifiez la console** - Le code OTP est toujours affiché dans la console
2. **Vérifiez les spams** - Surtout avec le domaine de test
3. **Vérifiez les logs Resend** - Dashboard > Logs pour voir le statut de l'envoi
4. **Vérifiez la clé API** - Assurez-vous qu'elle est correcte dans `.env.local`

### Erreur "Failed to send email"

1. Vérifiez que `RESEND_API_KEY` est définie
2. Vérifiez que la clé est valide (pas expirée)
3. Consultez les logs dans la console Node.js
4. Vérifiez le dashboard Resend pour les erreurs

### Les emails vont dans les spams

Si vous utilisez votre propre domaine :
1. Assurez-vous que les enregistrements DNS sont corrects
2. Ajoutez un enregistrement DMARC
3. Évitez les mots comme "gratuit", "urgent" dans le contenu
4. Testez votre email avec [mail-tester.com](https://www.mail-tester.com)

## Template d'email personnalisé

Le template actuel est dans `/lib/email.ts`. Vous pouvez le personnaliser :

```typescript
export async function sendOTPEmail({...}) {
  // Modifiez le HTML ici
  html: `...votre template...`
}
```

**Conseils pour un bon template :**
- Utilisez des tableaux HTML pour la compatibilité
- Évitez les CSS complexes
- Testez sur différents clients email (Gmail, Outlook, etc.)
- Gardez-le simple et professionnel

## Prochaines étapes

Une fois Resend configuré, vous pourrez aussi l'utiliser pour :
- ✉️ Confirmations de réservation
- ✉️ Rappels de réservation
- ✉️ Notifications d'annulation
- ✉️ Newsletters
- ✉️ Enquêtes de satisfaction

## Support

- Documentation Resend: [resend.com/docs](https://resend.com/docs)
- Dashboard Resend: [resend.com/dashboard](https://resend.com/dashboard)
- Support: support@resend.com
