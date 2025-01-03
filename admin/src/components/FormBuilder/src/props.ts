import type { ButtonProps, FormItemProps, GridItemProps, GridProps } from 'naive-ui'
import type { PropType, StyleValue } from 'vue'
import { propTypes } from '@/utils/propTypes'
import type { FormSchema } from './types/form'

export const basicProps = {
  model: {
    type: Object as PropType<Recordable>,
    default: {},
  },
  disabled: propTypes.bool.def(false),
  // Configuration des règles simplifiées, si vrai, elles seront converties en [{required:true}]
  require: propTypes.bool.def(false),
  // Vérifiez si les informations sont ajoutées avec le texte de l'étiquette
  rulesMessageJoinLabel: propTypes.bool.def(true),
  // Largeur d'étiquette largeur fixe
  labelWidth: propTypes.stringNumber.def(80),
  // Règles de configuration des formulaires
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  // S'il faut afficher sous forme de formulaire en ligne
  inline: propTypes.bool.def(false),
  // taille
  size: propTypes.string.def('medium'),
  // position de l'étiquette
  labelPlacement: propTypes.string.def('top'),
  // Si le composant a une largeur de 100%
  isFull: propTypes.bool.def(true),
  // S'il faut afficher les boutons de fonctionnement (requête/réinitialisation)
  showActionButtonGroup: propTypes.bool.def(true),
  // Afficher le bouton de réinitialisation
  showResetButton: propTypes.bool.def(true),
  // Configuration du bouton de réinitialisation
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,
  // Afficher le bouton de confirmation
  showSubmitButton: propTypes.bool.def(true),
  // Confirmer la configuration des boutons
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,
  // Bouton Développer-Réduire
  showAdvancedButton: propTypes.bool.def(true),
  // Confirmer le texte du bouton
  submitButtonText: propTypes.string,
  // Texte du bouton de réinitialisation
  resetButtonText: propTypes.string,
  // configuration de la grille
  gridProps: Object as PropType<GridProps>,
  // configuration gi
  giProps: Object as PropType<GridItemProps>,
  // Configuration de l'élément de formulaire
  formItemProps: Object as PropType<FormItemProps>,
  // style de grille
  baseGridStyle: Object as PropType<StyleValue>,
  // S'il faut plier
  collapsed: propTypes.bool.def(false),
  // Le nombre de lignes affichées par défaut
  collapsedRows: propTypes.number.def(1),
}
