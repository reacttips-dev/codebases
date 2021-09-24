import { extendTheme } from '@chakra-ui/react';
import Accordion from './Accordion/style';
import Alert from './Alert/style';
import Avatar from './Avatar/style';
import Badge from './Badge/Badge.style';
import Button from './Button/Button.style';
import CloseButton from './Button/CloseButton.style';
import Card from './Card/style';
import Checkbox from './Checkbox/Checkbox.style';
import Cover from './Cover/style';
import Divider from './Divider/Divider.style';
import Dropdown from './Dropdown/style';
import Form from './FormControl/style';
import FormLabel from './FormLabel/style';
import Heading from './Heading/style';
import ImageUpload from './ImageUpload/style';
import Input from './Input/style';
import Link from './Link/style';
import Menu from './Menu/style';
import Modal from './Modal/style';
import Notification from './Notification/style';
import Popover from './Popover/Popover.style';
import Progress from './Progress/Progress.style';
import Radio from './Radio/Radio.style';
import SearchResult from './SearchResult/style';
import Select from './Select/Select.style';
import Sidebar from './Sidebar/Sidebar.style';
import Skeleton from './Skeleton/Skeleton.style';
import SpaceCard from './SpaceCard/style';
import Switch from './Switch/style';
import Table from './Table/style';
import Tabs from './Tabs/style';
import Tag from './Tag/Tag.style';
import Text from './Text/style';
import Textarea from './Textarea/style';
import { breakpoints } from './theme/foundations/breakpoints';
import { colors } from './theme/foundations/colors';
import radii from './theme/foundations/radius';
import { shadows } from './theme/foundations/shadows';
import { sizes } from './theme/foundations/sizes';
import { spacing } from './theme/foundations/spacing';
import { fontSizes, fontWeights, textStyles, } from './theme/foundations/typography';
import zIndices from './theme/foundations/z-index';
import styles from './theme/styles';
import Userbar from './UserBar/style';
// Styling constants
export { ELLIPSIS_STYLES } from './Text/style';
const components = {
    Accordion,
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox,
    CloseButton,
    Cover,
    Divider,
    Dropdown,
    Form,
    FormLabel,
    Heading,
    ImageUpload,
    Input,
    Link,
    Menu,
    Modal,
    Notification,
    Popover,
    Progress,
    Radio,
    SearchResult,
    Select,
    Sidebar,
    Skeleton,
    SpaceCard,
    Switch,
    Table,
    Tabs,
    Tag,
    Text,
    Textarea,
    Userbar,
};
// TODO add correct theme type
export const theme = extendTheme({
    config: {
        cssVarPrefix: 'tribe',
    },
    colors,
    sizes,
    shadows,
    space: spacing,
    breakpoints,
    fontSizes,
    textStyles,
    fontWeights,
    styles,
    zIndices,
    radii,
    components,
});
//# sourceMappingURL=theme.js.map