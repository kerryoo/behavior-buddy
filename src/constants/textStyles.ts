import colors from './colors';

const textStyles = {
  title: {
    color: colors.default,
    fontWeight: '700',
    fontSize: 72,
  },
  display: {
    color: colors.default,
    fontWeight: '600',
    fontSize: 24,
  },
  header: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 24,
  },
  smallBody: {
    color: colors.default,
    fontWeight: '400',
    fontSize: 16,
  },
  label: {
    color: colors.default,
    fontWeight: '600',
    fontSize: 20,
  },
  largeBody: {
    color: colors.default,
    fontWeight: '400',
    fontSize: 20,
  },
  guides: {
    color: colors.default,
    fontWeight: '400',
    fontSize: 14,
  },
  link: {
    color: colors.interactive,
    fontSize: 16,
    fontWeight: '400',
    textDecorationLine: 'underline',
    textDecorationColor: colors.interactive,
  },
  input: {
    color: colors.default,
    fontWeight: '400',
    fontSize: 16,
    flex: 1,
  },
  note: {
    color: colors.disabled,
    fontWeight: '400',
    fontSize: 14,
  },
};

export default textStyles;
