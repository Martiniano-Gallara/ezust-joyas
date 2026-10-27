with open('scratch_script_28.txt', 'r', encoding='utf-8') as f:
    text = f.read()

print("Length:", len(text))
print("First 500 chars:", text[:500])
for word in ['Dez_h98EfCF', 'ezustjoyas', 'CAROUSEL', 'cdninstagram']:
    print(f"'{word}' in text: {word in text}")
