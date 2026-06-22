import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';
import { useTaskContext } from '../context/TaskContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

interface FormErrors {
  title?: string;
  description?: string;
}

export function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const descRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!title.trim()) {
      next.title = 'Title is required.';
    } else if (title.trim().length < 3) {
      next.title = 'Title must be at least 3 characters.';
    }
    if (!description.trim()) {
      next.description = 'Description is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      await addTask(title, description);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save the task. Please try again.');
      setSubmitting(false);
    }
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, !!errors.title && styles.inputError]}
            placeholder="What do you need to do?"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={text => { setTitle(text); clearError('title'); }}
            maxLength={100}
            returnKeyType="next"
            onSubmitEditing={() => descRef.current?.focus()}
            blurOnSubmit={false}
          />
          {errors.title ? (
            <Text style={styles.errorText}>{errors.title}</Text>
          ) : (
            <Text style={styles.counter}>{title.length}/100</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            ref={descRef}
            style={[styles.input, styles.textarea, !!errors.description && styles.inputError]}
            placeholder="Add a short description..."
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={text => { setDescription(text); clearError('description'); }}
            multiline
            numberOfLines={5}
            maxLength={500}
            textAlignVertical="top"
            returnKeyType="done"
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : (
            <Text style={styles.counter}>{description.length}/500</Text>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            (pressed || submitting) && styles.saveBtnPressed,
          ]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.saveBtnText}>
            {submitting ? 'Saving…' : 'Add Task'}
          </Text>
        </Pressable>

        <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 52,
  },
  field: {
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  textarea: {
    height: 130,
    paddingTop: 13,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 6,
    fontWeight: '500',
  },
  counter: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 5,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnPressed: {
    opacity: 0.8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  cancelBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
